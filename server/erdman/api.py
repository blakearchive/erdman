from flask import request, Blueprint
from .service import ErdmanDataService
import json

api = Blueprint('api', __name__, url_prefix='/api')


@api.route("/pages")
def get_pages():
    pages = ErdmanDataService.get_pages()
    return json.dumps(pages)

@api.route("/heading")
def get_pages_by_heading():
    heading = request.args.get("heading")
    page_ids = ErdmanDataService.get_pages_by_heading(heading)
    return json.dumps(page_ids)

@api.route("/search")
def search():
    q = request.args.get("q")
    results = ErdmanDataService.search(q)
    return json.dumps(results)