# encoding:utf-8
# 文件功能：清除指定文件或所有

import utils


def notice_server(address, user, password, file):
    headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    url = 'http://' + address + '/'
    data = {
        'username': user,
        'password': password,
        'tagId': file
    }
    return utils.get(url, data, headers)


def run(args):
    files = args.file.split(',')
    for file in files:
        flag = utils.rmdir(args.path + "/" + file)
        if flag:
            # 通知服务器
            try:
                result = notice_server(args.serverAddress, args.tagOwner, args.tagPassword, file)
                if not utils.parser_result(result):
                    utils.info('notice server failed: server')
            except:
                utils.info('notice server failed: connect')
            utils.info('remove ' + file)
        else:
            utils.info('remove ' + file + ' failed')
    utils.info('clear executed')
