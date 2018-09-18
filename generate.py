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
def generate_packet(name, cursor, size):
    meta = {}
    count = 0
    rows = cursor.fetchmany(int(size))
    while rows:
        for row in rows:
            v = '|||'.join('%s' % i for i in list(row))
            with open(name, 'a') as f:
                f.write(v.replace('\n', '') + '\n')
                count = count + 1
            # if count % 1000000 == 0:
            #     utils.info('generate ' + str(count / 1000000) + ' million data')
            if count % 10000 == 0:
                utils.info('generate ' + str(int(count / 10000)) + ' * 10000 data')
        if count % int(size) == 0:
            rows = cursor.fetchmany(int(size))
        else:
            rows = False
    with open(name, 'r') as f:
        content = f.read()
    index = cursor.description
    cols = []
    for i in range(len(index)):
        cols.append(index[i][0])
    meta.__setitem__("size", count)
    meta.__setitem__("md5", utils.get_md5(content))
    meta.__setitem__("colName", ','.join(cols))
    return meta


def generate_meta(name, data):
    with open(name, 'w') as f:
        f.write(data)


def write_to_list(content):
    with open('list.txt', 'a') as f:
        f.write(content)


def run(args):
    now = str(int(round(time.time() * 1000)))

    write_to_list(now + '|' + args.tagName + '|' + '正在生成\n')
    # 获取数据
    conn = utils.get_conn(args.host, args.dbUser, args.dbPassword, args.database)
    cursor = get_data(conn, args.sql, args.colName)

    # 生成数据包文件
    path = args.path + "/" + now
    utils.mkdir(path)
    name = args.tagOwner + "." + now
    real_path = path + "/" + name + ".data"
    meta = generate_packet(real_path, cursor, args.fetchSize)
    meta.__setitem__("timestamp", now)
    meta.__setitem__("dataName", real_path)
    meta.__setitem__("tagName", args.tagName)

    meta_json = utils.to_json(meta)
    # 生成meta文件
    real_path = path + "/" + name + ".meta"
    generate_meta(real_path, utils.encode(meta_json))
    utils.edit_list(now, '生成完毕\n')
    utils.info('generate ' + now + ' executed')
