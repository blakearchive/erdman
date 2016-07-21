import pysolr
import os

erdman_pages = pysolr.Solr(os.environ.get("SOLR_URL","http://localhost:8983/solr/erdman"))


class ErdmanDataService(object):
    @classmethod
    def get_pages(cls, page_ids=None):
        query = "page_id:(%s)" % "OR".join(page_ids) if page_ids else "*:*"
        return list(erdman_pages.search(query))

    @classmethod
    def search(cls, q):
        query = "contents:"+q
        return list(erdman_pages.search(query))