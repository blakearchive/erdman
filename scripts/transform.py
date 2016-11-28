from lxml import etree
from lxml.sax import saxify
from xml.sax.handler import ContentHandler
from xml.sax.saxutils import escape, unescape
from collections import OrderedDict
from itertools import count
import json
import pysolr
# import config

_counter = count(1)


class ErdmanTransformer(ContentHandler):
    def __init__(self):
        self.next_page_id = ""
        self.pages = []
        self.open_tags = []
        self.current_heading = []
        self.current_page = self.create_page()
        self.transformer = XMLTransformer()
        self.ignored_elements = ["front", "back", "body"]

    def create_page(self, page_id=""):
        headings = OrderedDict()
        current_heading = headings
        for (idx, attrs) in self.current_heading:
            current_heading[idx] = OrderedDict()
            current_heading = current_heading[idx]
        contents = [self.create_tag(tag_name, attrs) for (tag_name, attrs) in self.open_tags]
        if not page_id:
            page_id = "unid_" + str(_counter.next())
        return {
            "page_id": page_id,
            "headings": headings,
            "contents": contents
        }

    @staticmethod
    def key_value_pair_as_unicode(key, value):
        return '%s="%s"'.encode('utf-8') % (key.encode('utf-8'), value.encode('utf-8'))

    @classmethod
    def tag_with_attributes(cls, tag_name, attrs):
        attrs_text = [cls.key_value_pair_as_unicode(k, v) for (k, v) in attrs.items() if v]
        if attrs_text:
            tag_name += " %s".encode('utf-8') % ' '.encode('utf-8').join(attrs_text)
        return tag_name

    @classmethod
    def create_tag(cls, tag_name, attrs=None):
        template = "<%s>".encode('utf-8')
        if attrs:
            return template % cls.tag_with_attributes(tag_name, attrs)
        return template % tag_name

    def add_current_page_heading(self, name, level=0):
        current_heading = self.current_page["headings"]
        for i in range(level):
            current_heading = current_heading[self.current_heading[i][1]["id"]]
        current_heading[name] = OrderedDict()

    def startElementNS(self, name, qname, attrs):
        uri, localname = name
        # Strip the namespace field from the attribute key
        attrs = {k[1]: v for (k, v) in attrs.items()}
        if localname == 'div1':
            self.current_heading.append((attrs["id"], attrs))
            self.add_current_page_heading(attrs["id"])
            self.current_page["contents"].append("<span id='" + attrs["id"] + "'/>")
        elif localname == 'div2':
            self.current_heading.append((attrs["id"], attrs))
            self.add_current_page_heading(attrs["id"], 1)
            self.current_page["contents"].append("<span id='" + attrs["id"] + "'/>")
        elif localname == 'div3':
            self.current_heading.append((attrs["id"], attrs))
            self.add_current_page_heading(attrs["id"], 2)
            self.current_page["contents"].append("<span id='" + attrs["id"] + "'/>")
        elif localname == 'div4':
            self.current_heading.append((attrs["id"], attrs))
            self.add_current_page_heading(attrs["id"], 3)
            self.current_page["contents"].append("<span id='" + attrs["id"] + "'/>")
        elif localname == 'head':
            if len(self.current_heading) == 4:
                heading = self.current_heading[3]
                attrs["class"] = "heading-quaternary"
            elif len(self.current_heading) == 3:
                heading = self.current_heading[2]
                attrs["class"] = "heading-tertiary"
            elif len(self.current_heading) == 2:
                heading = self.current_heading[1]
                attrs["class"] = "heading-primary"
            elif len(self.current_heading) == 1:
                heading = self.current_heading[0]
                attrs["class"] = "heading-secondary"
            self.open_tags.append((localname, attrs))
            tag = self.create_tag('head'.encode('utf-8'), attrs)
            self.current_page["contents"].append(tag)
        elif localname == 'pb':
            self.next_page_id = attrs["n"]
            if self.current_page["contents"]:
                self.save_page()
            self.current_page = self.create_page(self.next_page_id)

        elif localname in self.ignored_elements:
            pass
        else:
            self.open_tags.append((localname, attrs))
            self.current_page["contents"].append(self.create_tag(localname, attrs))

    def generate_page_headings(self):
        def ordered_dict_to_list(ordered_dict):
            return [[k, ordered_dict_to_list(v)] for (k, v) in ordered_dict.items()]
        return ordered_dict_to_list(self.current_page["headings"])

    def save_page(self):
        page_html = self.generate_page_html()
        page_text = etree.fromstring(page_html).xpath("string()")
        self.current_page["contents"] = page_html
        self.current_page["text_contents"] = page_text
        self.current_page["headings"] = self.generate_page_headings()
        self.pages.append(self.current_page)

    def generate_page_html(self):
        page_attrs = {"class": "page", "id": self.current_page["page_id"]}
        page_tag = self.create_tag('div'.encode('utf-8'), page_attrs)
        page_tags_unicode = [c for c in self.current_page["contents"]]
        page_content = ''.encode('utf-8').join(page_tags_unicode)
        page_closing_tags = ''.encode('utf-8').join('</%s>' % tag for (tag, attrs) in reversed(self.open_tags))
        page_xml = page_tag + page_content + page_closing_tags + "</div>".encode('utf-8')
        page_html = self.transformer.transform(etree.fromstring(page_xml))
        return etree.tostring(page_html)

    def endElementNS(self, name, qname):
        uri, localname = name
        if localname in {'div1', 'div2', 'div3', 'div4'}:
            self.current_heading.pop()
        elif localname == 'pb':
            pass
        elif localname in self.ignored_elements:
            pass
        else:
            for entry in reversed(self.open_tags):
                if (entry[0]) == localname:
                    self.open_tags.remove(entry)
                    break
            self.current_page["contents"].append("</%s>" % localname)

    def characters(self, content):
        # unescaping then escaping here because of inconsistent XML escaping in source material
        self.current_page["contents"].append(escape(unescape(content)))

    @staticmethod
    def safe_encode(text):
        try:
            return text.encode("utf-8")
        except TypeError:
            return text


class XMLTransformer(object):

    def __init__(self):
        xslt_xml = etree.parse("../xsl/transcription.xsl")
        self.transform = etree.XSLT(xslt_xml)


def get_titles(tree):
    heads = tree.xpath("//head")
    seen_pages = set()

    def should_add(head):
        parent = head.getparent()
        if parent.tag in {"div1", "div2", "div3", "div4"}:
            id_ = parent.attrib["id"]
            if id_ not in seen_pages:
                seen_pages.add(id_)
                return True
        return False

    return {
            head.getparent().attrib["id"]: {
                'heading': head.xpath("string()").strip(),
                'page': head.getparent().attrib["page"] if head.getparent().attrib["page"] else ""
            } for head in heads if should_add(head)
        }

def parse_document(file_name):
    tree = etree.parse(file_name)
    handler = ErdmanTransformer()
    saxify(tree, handler)
    handler.save_page()  # get the last page
    titles = get_titles(tree)
    return handler, titles


def do_import(solr_url, data_only):
    titles, pages = parse_documents()
    if not data_only:
        populate_solr(solr_url, pages)
    write_data_files(pages, titles)


def parse_documents():
    titles = {}
    (erd1, erd1_titles) = parse_document("../data/erd1.xml")
    (erd2, erd2_titles) = parse_document("../data/erd2.xml")
    (erd3, erd3_titles) = parse_document("../data/erd3.xml")
    pages = erd1.pages + erd2.pages + erd3.pages
    titles.update(erd1_titles)
    titles.update(erd2_titles)
    titles.update(erd3_titles)
    return titles, pages


def get_notes():
    transformer = XMLTransformer()
    notes_document = etree.parse("../data/erd4.xml")
    notes = notes_document.xpath(".//note")
    return {n.attrib["id"]: etree.tostring(transformer.transform(n)) for n in notes if "id" in n.attrib}


def populate_solr(solr_url, pages):
    solr = pysolr.Solr(solr_url)
    solr.delete(q='*:*')
    for (i, page) in enumerate(pages):
        solr.add([{
            "id": i,
            "page_id": page["page_id"],
            "headings": json.dumps(page["headings"]),
            "contents": page["contents"],
            "text_contents": page["text_contents"]

        }])
    solr.optimize()


def write_data_files(pages, titles):
    notes = get_notes()
    notes_json = json.dumps(notes)
    with open("../client/src/data.js", 'w') as f:
        pages = [{"headings": p["headings"], "page_id": p["page_id"]} for p in pages]
        pages_json = json.dumps(pages)
        f.write("export const titles = %s, pages = %s, notes = %s;" % (json.dumps(titles), pages_json, notes_json))


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("solr_url", default='http://localhost:8983/solr/erdman')
    parser.add_argument("-d", "--data_only", action="store_true", default=False)
    args = parser.parse_args()
    do_import(args.solr_url, args.data_only)

if __name__ == "__main__":
    main()
