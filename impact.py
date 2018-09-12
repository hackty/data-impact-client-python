# encoding:utf-8
# 文件功能：上传数据包

import utils


def verify(meta):
    with open(meta['dataName'], 'r') as f:
        content = f.read()
        f.close()
        return meta['md5'] == utils.get_md5(content)


def tmp(file, salt, col, count):
    try:
        with open(file, 'r') as f:
            for line in f:
                cols = line.split('|||')
                v = utils.get_md5(cols[col] + salt)
                with open(file + '.tmp', 'a') as f_tmp:
                    f_tmp.write(v+'\n')
        return True
    except:
        return False


def run(args):
    try:
        meta_json = utils.decode(args.meta)
        meta = utils.from_json(meta_json)
    except:
        return print('parser meta failed')
    if verify(meta):
        # count = (meta['size'] % 30000000) + 1
        cols = list(meta['colName'].split(','))
        if tmp(meta['dataName'], args.salt, cols.index(args.colName), 0):
            url = 'http://'+args.serverAddress+'/upload'
            utils.upload(meta['dataName']+'.tmp', url)
            utils.rmfile(meta['dataName']+'.tmp')
            print('impact executed')
        else:
            print('Failed generate encrypt data file')
    else:
        print('verify data failed')
