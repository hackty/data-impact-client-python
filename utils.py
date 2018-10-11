# encoding:utf-8
# 文件功能：功能类

import mysql.connector
import os
import hashlib
import json
import base64
import urllib3
import time
import yaml


# 打印日志
def log(var1="", var2="", tp='info'):
    date = time.localtime(time.time())
    var = lan(var1)
    if var2 != "":
        var += ': ' + var2
    file = 'logs/' + str(date.tm_year) + '-' + str(date.tm_mon) + '-' + str(date.tm_mday)
    if tp == 'error':
        with open(file + '-err.log', 'a', encoding='utf-8') as f:
            f.write(time.asctime(time.localtime(time.time())) + ': ' + var + '\n')
    with open(file + '-info.log', 'a', encoding='utf-8') as f:
        f.write(time.asctime(time.localtime(time.time())) + ': ' + var + '\n')
    return print(var)


def lan(var, lan=None):
    try:
        with open('./lan.yaml', 'r', encoding='utf-8') as yaml_file:
            la = yaml.load(yaml_file.read())
            if lan is None:
                lan = la['default']
            return la[lan][var]
    except:
        return var


# 获取数据库连接
def get_mysql_conn(host, user, password, database):
    return mysql.connector.connect(host=host, user=user, password=password, database=database)


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
        log("error_file", path, 'error')
        return False
    for file in files:
        if os.path.isdir(path + "/" + file):
            rmdir(path + "/" + file)
        else:
            os.remove(path + "/" + file)
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
    dir_list = []
    files = os.listdir(path)
    for f in files:
        if os.path.isdir(path + '/' + f) and f[0] != '.':
            dir_list.append(f)
    return dir_list


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


# 解析服务器结果
def parser_result(result):
    re = from_json(result)
    return re['success']


# 修改数据集
def edit_list(key, status):
    with open('list.txt', 'r', encoding='utf-8')as f:
        data = f.readlines()
        for i in range(len(data)):
            t = data[i].split('|')
            if t[0] == key:
                data.remove(data[i])
                if status:
                    t[3] = status
                    data.insert(i, '|'.join(t))
                break
    with open('list.txt', 'w', encoding='utf-8')as f:
        f.writelines(data)
