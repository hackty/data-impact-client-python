# encoding:utf-8
# 文件功能：生成数据包和meta文件

import time
import utils
from utils import logger


# 数据类型分发
def source_filter():
    return {
        'mysql': handle_db,
        'file': handle_file
    }


# 生成来自db的数据包
def handle_db(args, name, now):
    try:
        conn = utils.get_mysql_conn(args.host, args.dbUser, args.dbPassword, args.database)
        cursor = conn.cursor()
        cursor.execute(args.sql)
    except:
        logger().error(['err_data_source', now+'/'+args.host])
        return {}
    meta = {}
    count = 0
    rows = cursor.fetchmany(int(args.fetchSize))
    while rows:
        for row in rows:
            v = '|||'.join('%s' % i for i in list(row))
            with open(name, 'a', encoding='utf-8') as f:
                f.write(v.replace('\n', '') + '\n')
                count = count + 1
            # if count % 1000000 == 0:
            #     utils.info('generate ' + str(count / 1000000) + ' million data: ' + name)
        if count % int(args.fetchSize) == 0:
            rows = cursor.fetchmany(int(args.fetchSize))
        else:
            rows = False
    with open(name, 'r', encoding='utf-8') as f:
        content = f.read()
    index = cursor.description
    cols = []
    for i in range(len(index)):
        cols.append(index[i][0])
    meta.__setitem__("size", count)
    meta.__setitem__("md5", utils.get_md5(content))
    meta.__setitem__("colName", ','.join(cols))
    return meta


# 生成来自文件的数据包
def handle_file(args, name, now):
    meta = {}
    count = 0
    col_size = len(args.columnName.split(','))
    with open(args.sourceFile, 'r', encoding='utf-8') as rf:
        with open(name, 'a', encoding='utf-8') as wf:
            for line in rf:
                count = count + 1
                rows = line.strip().split(args.separator)
                if len(rows) != col_size:
                    logger().error(['err_source_info', now+'/'+str(count)])
                    return {}
                wf.write('|||'.join(rows).replace('\n', '') + '\n')
    with open(name, 'r', encoding='utf-8') as f:
        content = f.read()
    meta.__setitem__("size", count)
    meta.__setitem__("md5", utils.get_md5(content))
    meta.__setitem__("colName", args.columnName)
    return meta


# 生成meta文件
def generate_meta(name, data):
    with open(name, 'w', encoding='utf-8') as f:
        f.write(data)


def write_to_list(content):
    with open('list.txt', 'a', encoding='utf-8') as f:
        f.write(content)


def run(args):
    # 准备阶段
    now = str(int(round(time.time() * 1000)))
    write_to_list(now + '|' + args.settingsActive + '|' + args.tagName + '|' + utils.lan('generating') + '\n')
    path = args.path + "/" + now
    utils.mkdir(path)
    name = args.tagOwner + "." + now
    real_path = path + "/" + name + ".data"

    # 生成数据包文件
    meta = source_filter()[args.sourceType](args, real_path, now)

    # 生成meta文件
    if meta != {}:
        real_path = path + "/" + name + ".meta"
        meta.__setitem__("timestamp", now)
        # meta.__setitem__("dataName", real_path)
        meta.__setitem__("tagName", args.tagName)
        meta_json = utils.to_json(meta)
        generate_meta(real_path, utils.encode(meta_json))
        utils.edit_list(now, utils.lan('generated') + '\n')
        logger().info(['generated', now])
    else:
        logger().error(['err_generate', now])
