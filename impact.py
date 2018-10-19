# encoding:utf-8
# 文件功能：上传数据包

import utils


def verify(meta, real_path):
    with open(real_path, 'r', encoding='utf-8') as f:
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
    for i in range(len(unencrypt_cols)):
        unencrypt_cols[i] = col_names.index(unencrypt_cols[i])
    try:
        unencrypt_cols.remove(encrypt_col)
    except:
        pass
    try:
        with open(file, 'r', encoding='utf-8') as f:
            line_count = 0
            file_count = 0
            for line in f:
                cols = line.strip().split('|||')
                v = utils.get_md5(cols[encrypt_col] + salt)
                for col in unencrypt_cols:
                    v = v + "|||" + cols[col]
                if line_count == 3000000:
                    file_count = file_count + 1
                    line_count = 0
                with open(tmp_file + str(file_count), 'a') as f_tmp:
                    f_tmp.write(v + '\n')
                line_count = line_count + 1
        return True
    except:
        return False


def up(num, tmp_file, args):
    url = 'http://' + args.serverAddress + '/upload'
    try:
        for i in range(num, -1, -1):
            file = tmp_file + str(i)
            utils.upload(file, url)
            utils.rmfile(file)
            num -= 1
    except:
        utils.log('err_upload_data', args.file, 'error')
        return utils.log('again_upload_data', 'python dic.py -u impact --file '+args.file+' --n '+num+' --job '+args.job, 'error')


def run(args):
    tmp_file = args.path + '/' + args.file + '/' + args.job + '.' + args.tagOwner + '.'
    real_path = args.path + "/" + args.file + "/" + args.tagOwner + "." + args.file + ".data"

    if args.n != '':
        return up(int(args.n), tmp_file, args)

    try:
        meta = get_meta(args.path, args.tagOwner, args.file)
        # meta_json = utils.decode(args.meta)
        meta_json = utils.decode(meta)
        meta = utils.from_json(meta_json)
    except:
        return utils.log('err_parser_meta', args.file, 'error')

    if not verify(meta, real_path):
        return utils.log('err_verify_data', args.file, 'error')

    num = int((meta['size'] - 1) / 3000000)
    col_names = list(meta['colName'].split(','))
    if not tmp(real_path, tmp_file, args.salt, col_names, args.encryptedColumn, args.unencryptedColumn):
        return utils.log('err_generate_encrypt', args.file, 'error')

    up(num, tmp_file, args)

    utils.log('info_impact', args.file)
