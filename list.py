# encoding:utf-8
# 文件功能：列出所有数据文件

import utils


def run(args):
    real_path = args.path + "/list.txt"
    f = open(real_path, 'w')
    dirs = utils.get_dirs(args.path)
    f.writelines(dirs)
    f.close()
    for x in dirs:
        print(x, end='')
