import pysolr
import os

erdman_pages = pysolr.Solr(os.environ.get("SOLR_URL","http://localhost:8983/solr/erdman"))


class ErdmanDataService(object):
    @classmethod
    def get_pages(cls):
        query = "*:*"
        results = list(erdman_pages.search(query, **{"rows":1000, "sort":"id asc"}))
        return results


    @classmethod
    def get_pages_by_heading(cls, heading=None):
        if heading:
            query = "headings:"+heading
            return list(erdman_pages.search(query, **{
                "fl": "page_id",
                "rows": 1
            }))

    @classmethod
    def search(cls, q):
        query = "text_contents:"+q
        result = erdman_pages.search(query, **{
             "hl": "true",
             "hl.fl":"text_contents",
             "hl.snippets":10,
             "hl.fragsize":50,
             "fl": "id, page_id",
             "rows": 10000,
             "sort": "id asc"
        })
        return {"docs":result.docs, "highlighting":result.highlighting}
