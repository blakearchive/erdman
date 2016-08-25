import pysolr
import os

erdman_pages = pysolr.Solr(os.environ.get("SOLR_URL"))


class ErdmanDataService(object):
    @classmethod
    def get_pages(cls, page_ids=None):
        query = "page_id:(%s)" % " OR ".join(page_ids) if page_ids else "*:*"
        results = list(erdman_pages.search(query))
        return results
