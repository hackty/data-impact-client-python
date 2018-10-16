# data-impact-client-python

## 环境要求
```
操作系统 : linux/windows
平台语言 : Python 3.6+
```

## 依赖安装

```
pip install pyyaml
pip install mysql-connector
pip install urllib3
pip install argparse
```

## 初始配置
```
1.根据平台注册账号，新建配置文件：settings/settings-yourname.yaml（模板请参考settings/settings-user1.yaml）
2.修改settings/settings.yaml设置启用配置文件
```


## 命令行方式启动

### generate

```
数据源 db
python dic.py --usage generate --tagName example --sql 'select * from test'
数据源 file
python dic.py --usage generate --tagName data_a --sourceType file --separator , --columnName aid,aname,aphone,asex,aage --sourceFile ./testcase/user_list_3.txt
```

### declare

```
python dic.py --usage declare --file 1539658640169
```

### impact

```
python dic.py --usage impact --file file --salt h3i4m5 --encryptedColumn col1 --unencryptedColumn col2[,col3...] --job 123123123
```


### list

```
python dic.py --usage list
```

### clear

```
python dic.py --usage clear --file file1[,file2[,file3...]]
```

## 界面方式启动

 - 本机安装好Docker
 - 导入镜像 
 ```
 $ docker pull evanyjq/dic
 ```
 - 第一次运行
 ```
 $ docker run -p 3000:3000 -v [项目所在位置]:/home/dic --name dic 1d2d264bbc4a
 ```
 - 访问页面 localhost:3000