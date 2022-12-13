# -*- coding: utf-8 -*-
# @Author   : LaiJiahao
# @Time     : 2022/12/8 16:44
# @File     : app.py
# @Project  : openAI

from flask import Flask,request,jsonify
from flask_cors import *
from openai import OpenAi
import json
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from config import configs
from concurrent.futures import ThreadPoolExecutor
from RecordLog import Flask_Log,System_Log


t = ThreadPoolExecutor(max_workers=200)
a = OpenAi()

app = Flask(__name__)
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200 per day" , "60 per hour" , "10 per minute"]
)

@app.route('/get_answer',methods= ['POST'])
def get_answer():
    CORS(app, supports_credentials=True)
    try:
        data = json.loads(request.data)
        prompt = data['prompt']
        user_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
        print(user_ip)
        try:

            # try:
            #     ai = t.submit(a.get_answer,prompt=prompt,max_tokens=data['max_tokens'],temperature=data['temperature'])
            #     answer = ai.result(timeout=60)
            #     msg = {
            #         "code": 200,
            #         "msg": answer
            #     }

            ai = t.submit(a.get_answer,prompt=prompt,max_tokens=configs['max_tokens'],temperature=configs['temperature'])
            answer = ai.result(timeout=60)
            msg = {
                "code": 200,
                "msg": answer
            }

            success_logs = {'prompt': prompt, 'ip': user_ip}
            Flask_Log('chatgpt.log', 'a+', msg['code'], success_logs)

            return jsonify(msg)

        except Exception as e:
            msg = {
                'code': 400,
                'error': repr(e),
                'msg':'出现意外的错误，请联系开发者等会再问我吧！'
            }
            failure_log = {'prompt': prompt, 'ip': user_ip , 'error': msg['error']}
            Flask_Log('chatgpt.log', 'a+', msg['code'], failure_log)
            return jsonify(msg)
    except:
        msg = {
            'code': 404,
            'msg': '服务器出现错误，开发者正在抢修中!'
        }

        System_Log('error.log','a+')
        return jsonify(msg)

if __name__ == '__main__':
    if configs['keys']:
        app.run(host='0.0.0.0',port=2053)
    else:
        print('请配置你的Keys')

