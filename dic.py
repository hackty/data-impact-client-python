# encoding:utf-8
# 文件功能：功能分发

import importlib
import yaml
import argparse
import utils


def get_settings():
    with open("./settings/settings.yaml", "r") as yaml_file:
        settings = yaml.load(yaml_file.read())
    with open("./settings/settings-" + settings['settings-active'] + ".yaml") as yaml_file:
        settings = yaml.load(yaml_file.read())
    return settings


def get_args():
    settings = get_settings()
    parser = argparse.ArgumentParser()
    keys = list(settings.keys())
    size = len(keys)
    for i in range(size):
        if keys[i] == 'usage':
            parser.add_argument("--usage", "-u", type=str, default=settings['usage'], nargs='?',
                                choices=['declare', 'generate', 'impact', 'clear', 'list'])
        else:
            parser.add_argument("--" + keys[i], type=str, nargs='?', default=settings[keys[i]])
    args = parser.parse_args()
    return args


if __name__ == '__main__':
    args = get_args()
    try:
        usage = importlib.import_module(args.usage)
        usage.run(args)
    except Exception as e:
        utils.log('import or run module failed', 'error')
        utils.log('Uncaught error: ', 'error')
        print(e)
