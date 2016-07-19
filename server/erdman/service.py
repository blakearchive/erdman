import pysolr
import config

erdman_pages = pysolr.Solr(config.solr_url)


class ErdmanDataService(object):
    @classmethod
    def get_pages(cls):
        return list(erdman_pages.search('*:*'))
