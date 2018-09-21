# encoding:utf-8
# 文件功能：清除指定文件或所有

import utils


def notice_server(address, user, password, file):
    headers = {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
    url = 'http://' + address + '/tag/remove'
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
                    utils.log('err_notice_server', file, 'error')
            except:
                utils.log('err_notice_connect', file, 'error')
            utils.log('info_clear', file)
        else:
            utils.log('err_clear', file, 'error')
