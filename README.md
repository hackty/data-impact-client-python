# data-impact-client-python

## 环境要求
```
操作系统 : linux/windows
平台语言 : Python 3.6+
          NodeJs v8.+(可选)
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
1.根据您在平台注册的账号，新建配置文件：settings/settings-yourname.yaml（模板请参考settings/settings-user1.yaml）
2.修改settings/settings.yaml的内容，以启用您的配置文件
```

## 命令行方式启动

以下所有命令的默认路径为项目根目录

### 生成数据包与描述文件（generate）：从原始文本文件/数据库表中生成所需数据包与描述文件

```
数据源 db
python dic.py --usage generate --tagName example --sql 'select * from test'
数据源 file
python dic.py --usage generate --tagName data_a --sourceType file --separator , --columnName aid,aname,aphone,asex,aage --sourceFile ./testcase/user_list_3.txt
```

### 申报描述文件（declare）：在区块链上申报您的数据包描述文件

```
python dic.py --usage declare --file 1539658640169
```

### 执行数据关联（impact）：将您的数据与他方数据在区块链上进行关联碰撞（该脚本由web服务端生成）

```
python dic.py --usage impact --file file --salt h3i4m5 --encryptedColumn col1 --unencryptedColumn col2[,col3...] --job 123123123
```


### 罗列本地数据包（list）：罗列本地数据包与描述文件

```
python dic.py --usage list
```

### 清空本地数据包（clear）：清空本地数据包与描述文件

```
python dic.py --usage clear --file file1[,file2[,file3...]]
```

## 界面方式启动

### 方式一：在安装好[NodeJs](https://nodejs.org "NodeJs")的环境下启动

 - 首次运行
```
 # cd dic_view
 # npm update
 # cd ..
 # node ./dic_view/bin/www
```

保持命令行界面开启

 - 再次运行
 
 ```
 # node ./dic_view/bin/www
 ```

### 方式二：从Docker启动


 - 无需安装Python和NodeJs环境
 - 本机安装好Docker
 - 导入镜像 
 ```
 # docker pull evanyjq/dic
 ```
 - 第一次运行
 ```
 # docker run -p [本地端口]:3000 -v [项目所在位置]:/home/dic --name dic 7ad08445af87
 ```
 首次启动需要下载支持文件，需等待几分钟

 运行成功后可退出命令行窗口

 - 访问页面 localhost:[本地端口]
 
 - 停止运行
 
 ```
 # docker stop dic
 ```
 
 - 再次运行
 
 ```
 # docker start dic
 ```