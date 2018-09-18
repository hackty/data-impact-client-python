# encoding:utf-8
# 文件功能：列出所有数据文件

import utils


def run(args):
    real_path = "list.txt"
    f = open(real_path, 'w')
    dirs = utils.get_dirs(args.path)
    f.write('\n'.join(dirs))
    f.close()
    print(','.join(dirs), end='')
