import pysolr
import os
import re
import time

SOLR_URL = os.environ.get("SOLR_URL", "http://127.0.0.1:8983/solr/erdman")


def _solr_client():
    # Build a fresh client so each retry gets a new HTTP session.
    return pysolr.Solr(SOLR_URL, timeout=10)

# pysolr keeps one requests.Session alive for the life of the wsgi worker with no
# retries configured; Solr's Jetty can close idle keep-alive sockets in the meantime,
# so the next reuse fails immediately with a connection error. Retrying establishes
# a fresh connection and succeeds. Some failure windows outlast a couple of quick
# retries, so back off a bit longer between attempts.
def _search_with_retry(query, retries=4, backoff=0.3, **kwargs):
    for attempt in range(retries + 1):
        try:
            return _solr_client().search(query, **kwargs)
        except pysolr.SolrError:
            if attempt == retries:
                raise
            time.sleep(backoff * (attempt + 1))


class ErdmanDataService(object):
    @classmethod
    def get_pages(cls):
        query = "*:*"
        results = list(_search_with_retry(query, **{"rows":1000, "sort":"id asc"}))
        return results


    @classmethod
    def get_pages_by_heading(cls, heading=None):
        if heading:
            query = "headings:"+heading
            return list(_search_with_retry(query, **{
                "fl": "page_id",
                "rows": 1
            }))

    @classmethod
    def search(cls, q):
        def process_element(e):
            if e == "AND" or e == "OR":
                return e
            else:
                return "contents:%s" % e
        search_elements = re.findall("([^\\s\"']+|\"[^\"]*\"|'[^']*')", q)
        query = " ".join(process_element(e) for e in search_elements)

        result = _search_with_retry(query, **{
             "hl": "true",
             "hl.fl": "text_contents",
             "hl.snippets": 10,
             "hl.fragsize": 50,
             "fl": "id, page_id",
             "rows": 10000,
             "sort": "id asc"
        })
        return {"docs":result.docs, "highlighting":result.highlighting}
