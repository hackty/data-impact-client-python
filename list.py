# encoding:utf-8
# 文件功能：列出所有数据文件

import utils


def run(args):
    real_path = "list.txt"
    real_dirs = sorted(utils.get_dirs(args.path))
    with open(real_path, 'r', encoding='utf-8') as f:
        dirs = f.readlines()
        user_dirs = []
        for i in range(len(dirs)):
            tmp = dirs[i].split('|')
            if tmp[1] == args.settingsActive:
                user_dirs.append(tmp[0])
        user_dirs = sorted(user_dirs)
        if len(user_dirs) == len(real_dirs):
            print(','.join(user_dirs))
        else:
            utils.log('compare', tp='error')
            real_dirs.reverse()
            user_dirs.reverse()
            utils.log('file_dirs', ','.join(real_dirs), 'error')
            utils.log('statistical', ','.join(user_dirs), 'error')

    # print(','.join(dirs), end='')
