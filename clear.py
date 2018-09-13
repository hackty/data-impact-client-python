# encoding:utf-8
# 文件功能：清除指定文件或所有

import utils


def run(args):
    files = args.file.split(',')
    for file in files:
        flag = utils.rmdir(args.path + "/" + file)
        if flag:
            # 通知服务器
            utils.info('remove ' + file)
            pass
        else:
            utils.info('remove ' + file + ' failed')
    utils.info('clear executed')
