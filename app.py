# -*- coding: utf-8 -*-
# @Author   : LaiJiahao
# @Time     : 2022/12/8 16:44
# @File     : app.py
# @Project  : openAI

from flask import Flask,request,jsonify
from flask_cors import cross_origin
from openai import OpenAi
import json

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day" , "50 per hour" , "5 per minute" , "1 per second"]
)

@app.route('/get_answer',methods= ['POST'])
@cross_origin()

def get_answer():
    try:
        #接收问题
        data = json.loads(request.data)
        prompt = data['prompt']

        try:

            ai = OpenAi(prompt=prompt,max_tokens=data['max_tokens'],temperature=data['temperature'])
            answer = ai.get_answer()

            msg = {
                "code": 200,
                "msg": answer
            }

        except:
            ai = OpenAi(prompt=prompt)
            answer = ai.get_answer()
            msg = {
                "code": 200,
                "msg": answer
            }
        return jsonify(msg)

    except Exception as e:
        msg = {
            'code': 400,
            'error': str(e),
            'msg':'出现意外的错误，请联系开发者等会再问我吧！'
        }
        return jsonify(msg)


if __name__ == '__main__':
    app.run(host='0.0.0.0',port=2053)
