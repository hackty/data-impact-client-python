# encoding:utf-8
# 文件功能：上传数据包

import utils


def verify(meta):
    with open(meta['dataName'], 'r') as f:
        content = f.read()
        f.close()
        return meta['md5'] == utils.get_md5(content)


def tmp(file, salt, col):
    try:
        with open(file, 'r') as f:
            line_count = 0
            file_count = 0
            for line in f:
                cols = line.split('|||')
                v = utils.get_md5(cols[col] + salt)
                if line_count == 30000000:
                    file_count = file_count + 1
                    line_count = 0
                with open(file + '.tmp' + str(file_count), 'a') as f_tmp:
                    f_tmp.write(v+'\n')
                line_count = line_count + 1
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
        num = int((meta['size'] - 1) / 30000000) + 1
        cols = list(meta['colName'].split(','))
        if tmp(meta['dataName'], args.salt, cols.index(args.colName)):
            url = 'http://'+args.serverAddress+'/upload'
            try:
                for i in range(num):
                    utils.upload(meta['dataName']+'.tmp' + str(i), url)
            except:
                print('upload data failed')
            for i in range(num):
                utils.rmfile(meta['dataName']+'.tmp' + str(i))
            print('impact executed')
        else:
            print('Failed generate encrypt data file')
    else:
        print('verify data failed')
