import pysolr

erdman_pages = pysolr.Solr('http://localhost:8983/solr/erdman-page')


class ErdmanDataService(object):
    @classmethod
    def get_pages(cls, page_ids):
        query = "page_id:(%s)" % "OR".join(page_ids)
        return erdman_pages.search(query)

