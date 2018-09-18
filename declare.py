# encoding:utf-8
# 文件功能：上传meta文件

import utils


def get_meta(file):
    with open(file, 'r') as f:
        content = f.read()
    return content


def declare(address, user, password, meta):
    headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    url = 'http://' + address + '/tag/declare'
    data = {
        'username': user,
        'password': password,
        'meta': meta
    }
    return utils.get(url, data, headers)


def run(args):
    # 读取meta文件
    real_file = args.path + "/" + args.file + '/' + args.tagOwner + '.' + args.file + '.meta'
    meta = get_meta(real_file)

    # 上传meta
    try:
        result = declare(args.serverAddress, args.tagOwner, args.tagPassword, meta)
        if not utils.parser_result(result):
            utils.info('post meta failed: server')
        else:
            utils.edit_list(args.file, '已发布\n')
    except:
        utils.info('post meta failed: connect')
    utils.info('declare executed')
