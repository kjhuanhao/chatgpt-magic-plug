# -*- coding: utf-8 -*-
# @Author   : LaiJiahao
# @Time     : 2022/12/13 12:39
# @File     : RecordLog.py
# @Project  : 未命名
# @desc     :
import datetime
import traceback

def Flask_Log(filename,write_way,code,logs):
    """
    :param filename: 文件名
    :param write_way: 写入方式 参考open的参数
    :param code: 状态码
    :param logs: 要记录的内容
    :return: NONE
    """
    nowtime = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with open(filename,write_way,encoding='utf-8') as f:
        if code == 200:
            f.write('INFO ' + nowtime + '\t'+ str(logs) + '\n')

        else:
            f.write('ERROR '  + nowtime + '\t'+ str(logs) + '\n')

def System_Log(filename,write_way):
    nowtime = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    with open(filename, write_way, encoding='utf-8') as f:
        text = "==========================================================\n"
        f.write('ERROR ' + nowtime + '\n' + traceback.format_exc() + text)



