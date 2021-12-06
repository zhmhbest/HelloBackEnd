from flask import Flask, request

app = Flask(__name__)


@app.route("/")
def index():
    msg = {
        'line': {
            'method': request.method,
            'path': request.path,
            'args': request.args,
        },
        'headers': {
            'headers': dict(request.headers),
            'cookies': request.cookies,
        },
        'body': {
            'data': str(request.data, encoding="utf-8"),
            'form': request.form,
            # 'files': request.files
        }
    }
    return msg, 200, {'Content-Type': 'text/json'}


if __name__ == '__main__':
    app.run()
