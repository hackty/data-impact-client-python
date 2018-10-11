# encoding:utf-8
# 文件功能：上传数据包

import utils


def verify(meta):
    with open(meta['dataName'], 'r', encoding='utf-8') as f:
        content = f.read()
        f.close()
        return meta['md5'] == utils.get_md5(content)


def get_meta(path, user, file):
    real_file = path + '/' + file + '/' + user + '.' + file + '.meta'
    with open(real_file, 'r', encoding='utf-8') as f:
        content = f.read()
    return content


def tmp(file, tmp_file, salt, col_names, encrypt_col, unencrypt_cols):
    encrypt_col = col_names.index(encrypt_col)
    unencrypt_cols = unencrypt_cols.split(',')
    unencrypt_cols.remove(encrypt_col)
    for i in range(len(unencrypt_cols)):
        unencrypt_cols[i] = col_names.index(unencrypt_cols[i])
    try:
        with open(file, 'r', encoding='utf-8') as f:
            line_count = 0
            file_count = 0
            for line in f:
                cols = line.strip().split('|||')
                v = utils.get_md5(cols[encrypt_col] + salt)
                for col in unencrypt_cols:
                    v = v + "|||" + cols[col]
                if line_count == 30000000:
                    file_count = file_count + 1
                    line_count = 0
                with open(tmp_file + str(file_count), 'a') as f_tmp:
                    f_tmp.write(v + '\n')
                line_count = line_count + 1
        return True
    except:
        return False


def run(args):
    try:
        meta = get_meta(args.path, args.tagOwner, args.file)
        # meta_json = utils.decode(args.meta)
        meta_json = utils.decode(meta)
        meta = utils.from_json(meta_json)
    except:
        return utils.log('err_parser_meta', args.file, 'error')
    tmp_file = args.path + '/' + args.file + '/' + args.job + '.' + args.tagOwner + '.'
    if verify(meta):
        num = int((meta['size'] - 1) / 30000000) + 1
        col_names = list(meta['colName'].split(','))
        if tmp(meta['dataName'], tmp_file, args.salt, col_names, args.encryptedColumn, args.unencryptedColumn):
            url = 'http://' + args.serverAddress + '/upload'
            for i in range(num):
                file = tmp_file + str(i)
                try:
                    utils.upload(file, url)
                except:
                    utils.log('err_upload_data', args.file, 'error')
                utils.rmfile(file)
        else:
            utils.log('err_generate_encrypt', args.file, 'error')
    else:
        utils.log('err_verify_data', args.file, 'error')
    utils.log('info_impact', args.file)
