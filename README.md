# data-impact-client-python

## 命令行方式启动

### generate

```
数据源 db
python dic.py --usage[-u] generate --tagName example --sql 'select * from test'
数据源 file
python dic.py --usage[-u] generate --tagName example --separator , --columnName id,phone,name --sourceFile /Users/yejiaquan/Code/Company/Impact/impact/test.data
```

### declare

```
python dic.py --usage[-u] declare --file file
```

### impact

```
python dic.py --usage[-u] impact --file file --salt h3i4m5 --encryptedColumn col1 --unencryptedColumn col2[,col3...] --job 123123123
```


### list

```
python dic.py --usage[-u] list
```

### clear

```
python dic.py --usage[-u] clear --file file1[,file2[,file3...]]
```

## 界面方式启动

 - 本机安装好Docker
 - 导入镜像
