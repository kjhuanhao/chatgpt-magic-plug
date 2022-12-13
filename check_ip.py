# -*- coding: utf-8 -*-
# @Author   : LaiJiahao
# @Time     : 2022/12/13 17:41
# @File     : check_ip.py
# @Project  : 未命名
# @desc     :
from AiRedis import RedisConfig
import time

MyRedis = RedisConfig()
r = MyRedis.UseRedis()


def check_ip_s(user_ip):
    nowTime = str(time.time()).split('.')[0]
    nowTime = int(round(int(nowTime)))
    if r.get(str(user_ip)):
        r.hset('BLACK_IP', user_ip, str(nowTime))

    if r.hget('BLACK_IP', user_ip) :
        state = {
            'code': 403,
            "msg" : "由于请求过于频繁，你的IP已禁，请联系开发者解除"
        }
        return state
    else:
        if r.hget('IP_INFO', user_ip):
            #先判断有没有10个
            redis_time = eval(r.hget('IP_INFO', user_ip))
            count = nowTime - redis_time[0]
            if len(redis_time) < 10:
                redis_time.append(nowTime)
                r.hset('IP_INFO', user_ip, str(redis_time))
                state = {
                    'code': 200
                }
                return state
            elif count < 60 and len(redis_time) == 10:
                r.set(str(user_ip),'wait',ex=30)
                state = {
                    "code": 202,
                    "msg": "请勿频繁搜索，请30S后再进行搜索，否则将禁止使用此脚本"
                }
                return state
            elif count > 60 and len(redis_time) == 10:
                pre_list = [nowTime]
                r.hset('IP_INFO', user_ip, str(pre_list))
                state = {
                    'code': 200
                }
                return state


        else:
            pre_list = [nowTime]
            r.hsetnx('IP_INFO', user_ip, str(pre_list))
            state = {
                'code': 200
            }
            return state



# print(check_ip_s('127.0.0.1'))