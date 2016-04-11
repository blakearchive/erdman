from lxml import etree
from lxml.sax import saxify
from xml.sax.handler import ContentHandler
from xml.sax.saxutils import escape, unescape
from collections import OrderedDict
import json


class ErdmanTransformer(ContentHandler):

    def __init__(self):
        self.pages = []
        self.open_tags = []
        self.current_heading = []
        self.current_page = self.create_page()
        self.transformer = XMLTransformer()
        self.ignored_elements = {"front", "back", "body"}

    def create_page(self, page_id=""):
        headings = OrderedDict()
        current_heading = headings
        for (idx, attrs) in self.current_heading:
            current_heading[idx] = OrderedDict()
            current_heading = current_heading[idx]
        contents = [self.create_tag(tag_name, attrs) for (tag_name, attrs) in self.open_tags]
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
        if attrs:
            return "<%s>".encode('utf-8') % cls.tag_with_attributes(tag_name, attrs)
        return "<%s>".encode('utf-8') % tag_name

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
        elif localname == 'div2':
            self.current_heading.append((attrs["id"], attrs))
            self.add_current_page_heading(attrs["id"], 1)
        elif localname == 'div3':
            self.current_heading.append((attrs["id"], attrs))
            self.add_current_page_heading(attrs["id"], 2)
        elif localname == 'div4':
            self.current_heading.append((attrs["id"], attrs))
            self.add_current_page_heading(attrs["id"], 3)
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
            attrs["id"] = heading[1]["id"]
            self.open_tags.append((localname, attrs))
            tag = self.create_tag('head'.encode('utf-8'), attrs)
            self.current_page["contents"].append(tag)
        elif localname == 'pb':
            if self.current_page["contents"]:
                self.save_page()
                self.current_page = self.create_page(attrs["n"])

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
        self.current_page["contents"] = self.generate_page_html()
        self.current_page["headings"] = self.generate_page_headings()
        self.pages.append(self.current_page)

    def generate_page_html(self):
        page_attrs = {"class": "page", "id": self.current_page["page_id"]}
        page_tag = self.create_tag('div'.encode('utf-8'), page_attrs)
        page_tags_unicode = [c for c in self.current_page["contents"]]
        page_content = ''.encode('utf-8').join(page_tags_unicode)
        page_closing_tags = ''.encode('utf-8').join('</%s>' % tag for (tag, attrs) in reversed(self.open_tags))
        page_xml = page_tag + page_content + page_closing_tags + "</div>".encode('utf-8')
        return etree.tostring(self.transformer.transform(etree.fromstring(page_xml)))

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
    return {head.getparent().attrib["id"]: head.xpath("string()").strip() for head in heads
            if head.getparent().tag in {"div1", "div2", "div3", "div4"}}

def parse_document(file_name):
    tree = etree.parse(file_name)
    handler = ErdmanTransformer()
    saxify(tree, handler)
    handler.save_page()  # get the last page
    titles = get_titles(tree)
    return handler, titles


def run():
    titles = {}
    (erd1, erd1_titles) = parse_document("../data/erd1.xml")
    (erd2, erd2_titles) = parse_document("../data/erd2.xml")
    (erd3, erd3_titles) = parse_document("../data/erd3.xml")
    (erd4, erd4_titles) = parse_document("../data/erd4.xml")
    with open("../client/src/data.js", 'w') as f:
        pages = erd1.pages + erd2.pages + erd3.pages + erd4.pages
        titles.update(erd1_titles)
        titles.update(erd2_titles)
        titles.update(erd3_titles)
        titles.update(erd4_titles)
        f.write("var erdmanData = {pages: %s, titles: %s};" % (json.dumps(pages), json.dumps(titles)))


if __name__ == "__main__":
    run()