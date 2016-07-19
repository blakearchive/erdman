from flask import request, Blueprint
from .service import ErdmanDataService
import json

api = Blueprint('api', __name__, url_prefix='/api')


@api.route("/pages")
def get_pages():
    pages = ErdmanDataService.get_pages()
    return json.dumps(pages)
