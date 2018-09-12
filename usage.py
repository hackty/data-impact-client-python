# encoding:utf-8
# 文件功能：功能分发

import importlib
import yaml
import argparse


def get_settings():
    with open("./settings.yaml", "r") as yaml_file:
        settings = yaml.load(yaml_file.read())
    with open("./settings-"+settings['settings-active']+".yaml") as yaml_file:
        settings = yaml.load(yaml_file.read())
    return settings


def get_args():
    settings = get_settings()
    parser = argparse.ArgumentParser()
    keys = list(settings.keys())
    values = list(settings.values())
    size = len(keys)
    parser.add_argument("--usage", "-u", type=str, default=values[0],
                        choices=['declare', 'generate', 'impact', 'clear', 'list'])
    for i in range(1, size):
        parser.add_argument("--"+keys[i], type=str, nargs='?', default=values[i])
    args = parser.parse_args()
    return args


if __name__ == '__main__':
    args = get_args()
    # args_dict = args.__dict__
    # keys = list(args_dict.keys())
    # values = list(args_dict.values())
    # size = len(keys)
    usage = importlib.import_module(args.usage)
    # for i in range(size):
    #     print(values[i])
    usage.run(args)
