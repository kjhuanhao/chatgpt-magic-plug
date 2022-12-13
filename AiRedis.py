# -*- coding: utf-8 -*-
# @Author   : LaiJiahao
# @Time     : 2022/11/30 22:38
# @File     : HotRedis.py
# @Project  : redis配置

import redis


class RedisConfig:
    def __init__(self):
        self.host = '127.0.0.1'
        self.port = '6379'
        self.decode_responses = True
        self.db = 0


    def UseRedis(self):
        poll = redis.ConnectionPool(host=self.host, port=self.port,decode_responses=self.decode_responses,db=self.db)
        r = redis.Redis(connection_pool=poll)
        return r
