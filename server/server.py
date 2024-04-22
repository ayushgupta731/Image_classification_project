from flask import Flask ,request , jsonify
import util

app = Flask(__name__)

# for checking purpose
# @app.route('/hello')
# def hello():
#     return "hi"
#
# if __name__ == "__main__":
#     app.run(port = 5000)


@app.route('/classify_image' , methods = ['GET','POST'])


def classify_image():
    image_data = request.form['image_data']

    response = jsonify(util.classify_image(image_data))

    response.headers.add('Access-Control-Allow-Origin', '*')

    return response

if __name__ == "__main__":
    print("Starting Python Flask Server For Image Classification")
    util.load_saved_artifacts()
    app.run(port=5000)