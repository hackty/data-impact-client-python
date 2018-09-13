# data-impact-client-python

### clear

```
python usage.py --usage[-u] clear --file file1[,file2[,file3...]] --tagOwner admin --tagPassword 123456
```

### declare

```
python usage.py --usage[-u] declare --file file --tagOwner admin --tagPassword 123456 --serverAddress 127.0.0.1:8080
```

### generate

```
python usage.py --usage[-u] generate --tagName example --sql 'select * from test' --host 'localhost' --sqlUser admin --sqlPassword 123456 --database impact --tagOwner admin
```

### impact

```
python usage.py --usage[-u] impact --meta ... --salt h3i4m5 --colName col --serverAddress 127.0.0.1:8080
```

### list

```
python usage.py --usage[-u] list
```