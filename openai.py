# -*- coding: utf-8 -*-
# @Author   : LaiJiahao
# @Time     : 2022/12/8 16:44
# @File     : openai.py
# @Project  : openAI
import random
from config import configs
import requests


class OpenAi:
    def __init__(self,prompt,max_tokens=configs['max_tokens'],temperature=configs['temperature']):
        # 替换为你的api_key <https://beta.openai.com/account/api-keys>
        keys = configs['keys']
        key = random.choices(keys)
        self.api_key = key[0]
        # 使用的模型:功能最强大的 GPT-3
        self.model = "text-davinci-003"
        # 询问的问题
        self.prompt = prompt
        self.url = "https://api.openai.com/v1/completions"
        # 这个是设置回答的长度,最大可以设置到4096 (免费额度为$18,该值影响你的用量)
        self.max_tokens = max_tokens

        #值越高意味着模型将承担更多风险。对于更具创造性的应用程序，请尝试 0.9,建议0.5-0.6
        self.temperature = temperature
    def get_answer(self):

        if self.max_tokens <= 4096 and self.temperature <= 0.9:
            if self.prompt:
                headers = {
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {self.api_key}"
                }

                # Set up the API data
                data = {
                    "model": "text-davinci-003",
                    "prompt": self.prompt,
                    "max_tokens": self.max_tokens,
                    "temperature": self.temperature,
                }
                # Make the API request
                response = requests.post(self.url, headers=headers, json=data)

                # Print the response

                answer = response.json()['choices'][0]['text']
            else:
                answer= "问题不能为空"
        else:
            answer = '你的max_tokens或temperature值过大！'
        return answer

# pool = threadpool.ThreadPool(10)
# resps = threadpool.makeRequests(OpenAi(prompt="用js画一个爱心",max_tokens=2000,temperature=0.6).get_answer,'')
# for res in resps:
#     pool.putRequest(res)
#     print(res)
# pool.wait()
