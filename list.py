# encoding:utf-8
# 文件功能：列出所有数据文件

import utils


def run(args):
    real_path = "list.txt"
    real_dirs = utils.get_dirs(args.path)
    with open(real_path, 'r', encoding='utf-8') as f:
        dirs = f.readlines()
        user_dirs = []
        for i in range(len(dirs)):
            tmp = dirs[i].split('|')
            if tmp[1] == args.settingsActive:
                user_dirs.append(tmp[0])
        if len(user_dirs) == len(real_dirs):
            print(','.join(user_dirs))
        else:
            utils.log('compare', tp='error')
            utils.log('file_dirs', ','.join(sorted(real_dirs)), 'error')
            utils.log('statistical', ','.join(sorted(user_dirs)), 'error')

    # print(','.join(dirs), end='')
