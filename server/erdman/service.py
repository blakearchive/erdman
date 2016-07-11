import pysolr
import config

erdman_pages = pysolr.Solr(config.solr_url)


class ErdmanDataService(object):
    @classmethod
    def get_pages(cls, page_ids):
        query = "page_id:(%s)" % "OR".join(page_ids)
        return list(erdman_pages.search(query))
