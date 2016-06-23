from erdman import app
from flask import send_from_directory


app.config["DEBUG"] = True
app.config["SECRET_KEY"] = "not_so_secret_key"
app.config["STATIC_FOLDER"] = "/home/nathan/Projects/erdman/client/dist/"


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    """
    This catch all path is used for testing purposes.  In production this should be handled by the web server.
    """
    return send_from_directory(app.config["STATIC_FOLDER"], "index.html")


if __name__ == "__main__":
    app.run(port=8002)
