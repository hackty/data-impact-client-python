# encoding:utf-8
# 文件功能：生成数据包和meta文件

import time
import utils


# 获取数据
def get_data(conn, sql, cols):
    cursor = conn.cursor()
    if cols != '' and cols is not None:
        str(sql).replace('*', cols)
    cursor.execute(sql)
    return cursor


# 生成数据包
def generate_packet(name, cursor):
    meta = {}
    size = 0
    with open(name, 'w') as f:
        row = cursor.fetchone()
        while row:
            v = '|||'.join('%s' % i for i in list(row))
            f.write(v.replace('\n', '') + '\n')
            size = size + 1
            row = cursor.fetchone()
    with open(name, 'r') as f:
        content = f.read()
    meta.__setitem__("size", size)
    meta.__setitem__("md5", utils.get_md5(content))
    return meta


def generate_meta(name, data):
    with open(name, 'w') as f:
        f.write(data)


def run(args):
    now = int(round(time.time() * 1000))

    # 获取数据
    conn = utils.get_conn(args.host, args.user, args.password, args.database)
    cursor = get_data(conn, args.sql, args.colName)

    # 生成数据包文件
    path = args.path + "/" + str(now)
    utils.mkdir(path)
    name = args.tagOwner + "." + str(now)
    real_path = path + "/" + name + ".data"
    meta = generate_packet(real_path, cursor)
    meta.__setitem__("timestamp", now)
    meta.__setitem__("dataName", real_path)
    meta.__setitem__("tagName", args.tagName)
    meta.__setitem__("colName", args.colName)

    meta_json = utils.to_json(meta)
    # 生成meta文件
    real_path = path + "/" + name + ".meta"
    generate_meta(real_path, utils.encode(meta_json))
    print('generate ' + str(now) + ' executed')
