# encoding:utf-8
# 文件功能：功能分发

import importlib
import yaml
import argparse
import utils
from utils import timer as Timer


def cover_settings(name, settings, names):
    global setting
    if name in names:
        return settings
    with open("./settings/settings-" + name + ".yaml", 'r', encoding='utf-8') as yaml_file:
        names.append(name)
        tmp = yaml.load(yaml_file.read())
        if tmp is None:
            return settings
        elif tmp.get('settingBase') is None:
            settings.update(tmp)
            return settings
        else:
            setting_list = tmp['settingBase'].split(',')
            for setting_item in setting_list:
                setting = cover_settings(setting_item, settings, names)
            setting.update(tmp)
            return setting


def get_settings():
    with open("./settings/settings.yaml", "r", encoding='utf-8') as yaml_file:
        settings = yaml.load(yaml_file.read())
    settings = cover_settings(settings['settingsActive'], settings, [])
    return settings


def get_args():
    settings = get_settings()
    parser = argparse.ArgumentParser()
    keys = list(settings.keys())
    size = len(keys)
    for i in range(size):
        if keys[i] == 'usage':
            parser.add_argument("--usage", "-u", type=str, default=str(settings['usage']), nargs='?',
                                choices=['declare', 'generate', 'impact', 'clear', 'list'])
        else:
            parser.add_argument("--" + keys[i], type=str, nargs='?', default=str(settings[keys[i]]))
    args = parser.parse_args()
    return args


if __name__ == '__main__':
    try:
        args = get_args()
        utils.mkdir('./logs')
        usage = importlib.import_module(args.usage)
        timer = Timer()
        usage.run(args)
        timer.log()
    except Exception as e:
        utils.log('err_module', tp='error')
        utils.log('err_uncaught', tp='error')
        utils.log(str(e), tp='error')
