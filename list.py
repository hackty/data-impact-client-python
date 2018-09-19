# encoding:utf-8
# 文件功能：列出所有数据文件

import utils


def run(args):
    real_path = "list.txt"
    with open(real_path, 'r') as f:
        dirs = f.readlines()
        for i in range(len(dirs)):
            dirs[i] = dirs[i].split('|')[0]
    real_dirs = utils.get_dirs(args.path)
    if len(dirs) == len(real_dirs):
        print(','.join(dirs), end='')
    else:
        utils.log('compare', 'error')
        utils.log('file_dirs', ','.join(real_dirs), 'error')
        utils.log('statistical', ','.join(dirs), 'error')
    # print(','.join(dirs), end='')
