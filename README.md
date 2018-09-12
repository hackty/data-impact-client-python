# data-impact-client-python

### clear

```
python usage.py --usage[-u] clear --path /Users/admin/impact --file file1[,file2[,file3...]] --tagOwner admin --tagPassword 123456
```

### declare

```
python usage.py --usage[-u] declare --path /Users/admin/impact --file file --tagOwner admin --tagPassword 123456 --serverAddress 127.0.0.1:8080
```

### generate

```
python usage.py --usage[-u] generate --path /Users/admin/impact --host 'localhost' --user admin --password 123456 --database impact --sql 'select * from test' --colName [col1[,col2[,col3...]]] --tagOwner admin --tagName example
```

### impact

```
python usage.py --usage[-u] impact --meta ... --salt h3i4m5 --colName col --serverAddress 127.0.0.1:8080
```

### list

```
python usage.py --usage[-u] list --path /Users/admin/impact
```