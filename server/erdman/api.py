from flask import request, Blueprint
from .service import ErdmanDataService
import json

api = Blueprint('api', __name__, url_prefix='/api')


@api.route("/pages")
def get_pages():
    page_ids = request.args.getlist("page_id")
    pages = ErdmanDataService.get_pages(page_ids)
    return json.dumps(pages)

@api.route("/search")
def search():
    q = request.args.get("q")
    pages = ErdmanDataService.search(q)
    return json.dumps(pages)