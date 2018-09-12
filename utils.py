# encoding:utf-8
# 文件功能：功能类

import mysql.connector
import os
import hashlib
import json
import base64
import urllib3


# 获取数据库连接
def get_conn(host, user, passwd, database):
    return mysql.connector.connect(
        host=host,
        user=user,
        passwd=passwd,
        database=database)


# 创建目录
def mkdir(path):
    folder = os.path.exists(path)
    if not folder:
        os.makedirs(path)


# 删除目录
def rmdir(path):
    try:
        files = os.listdir(path)
    except FileNotFoundError:
        print("File not found")
        return False
    for file in files:
        if os.path.isdir(file):
            rmdir(file)
            os.rmdir(file)
        else:
            os.remove(path+"/"+file)
    os.rmdir(path)
    return True


def rmfile(file):
    os.remove(file)


# 计算字符md5值
def get_md5(var):
    return hashlib.md5(var.encode('utf-8')).hexdigest()


# 将对象转换为json字符串
def to_json(var):
    return json.dumps(var)


# 将json字符串转换为对象
def from_json(var):
    return json.loads(var)


# base64编码
def encode(var1):
    var2 = base64.b64encode(var1.encode('utf-8'))
    return str(var2, 'utf-8')


# base64解码
def decode(var1):
    var2 = base64.b64decode(var1.encode('utf-8'))
    return str(var2, 'utf-8')


# 获取目录下所有文件夹名称
def get_dirs(path):
    dirList = []
    files = os.listdir(path)
    for f in files:
        if os.path.isdir(path + '/' + f) and f[0] != '.':
            dirList.append(f+'\n')
    return dirList


# post 方法
def post(url, data, headers):
    http = urllib3.PoolManager()
    r = http.request('post', url, fields=data, headers=headers)
    return r.data.decode()


# get 方法
def get(url, data, headers):
    http = urllib3.PoolManager()
    r = http.request('get', url, fields=data, headers=headers)
    return r.data.decode()


# 上传文件
def upload(file, url):
    http = urllib3.PoolManager()
    r = http.request('POST', url, fields={'file': (os.path.basename(file), open(file).read(), 'text/plain')})
    return r.data.decode()
