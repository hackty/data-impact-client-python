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
        utils.edit_list(file, None)
        if flag:
            # 通知服务器
            try:
                result = notice_server(args.serverAddress, args.tagOwner, args.tagPassword, file)
                if not utils.parser_result(result):
                    utils.log('notice server failed: server', 'error')
            except:
                utils.log('notice server failed: connect', 'error')
            utils.log('remove ' + file, 'info')
        else:
            utils.log('remove ' + file + ' failed', 'error')
    utils.log('clear executed', 'info')
