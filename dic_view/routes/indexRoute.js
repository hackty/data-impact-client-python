const express = require('express');
const router = express.Router();
const YAML = require('yamljs');
const fs = require("fs");
const spawn=require('child_process').spawn;

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};

// 跳转首页
router.get('/', function (req, res) {
    res.render('index');
});

// 获取数据集列表
router.get('/list', function (req, res) {
    let draw = req.query.draw;
    let setting = req.query.setting;
    let length = Number(req.query.length);
    let start = Number(req.query.start);
    let keyword = setting + ' ' + req.query.search.value;
    let content = fs.readFileSync('list.txt').toString();
    let list = content.split('\n');
    let keywords = keyword.split(' ');
    let index = keywords.indexOf('');
    if (index > -1) keywords.splice(index, 1);
    list.pop();
    let l = [];
    for (let i = 0; i < list.length; i++) {
        let k = 0;
        for (let j = 0; j < keywords.length; j++)
            if (list[i].indexOf(keywords[j])!==-1) k++;
        if (k === keywords.length) l.push(list[i]);
    }
    let data = [];
    for (let i = 0; i + start < l.length && i < Number(length); i++) {
        let tmp = l[i + start].split('|');
        let d = {no: tmp[0], tag: tmp[2], status: tmp[3]};
        data.push(d)
    }
    return res.send({draw: draw, data: data, recordsTotal:l.length, recordsFiltered: l.length}).end();
});

// 清除数据集
router.get('/clear', function (req, res) {
    let file = req.query.file;
    try {
        let shell = spawn('python3', ['dic.py', '-u', 'clear', "--file", file]);
        //todo 结果处理
        shell.stdout.on('end', () => {
            return res.send(JSON.stringify({success: true, message: '成功'})).end();
        });
    }catch (e) {
        return res.send(e).end();
    }
});

// 生成数据集
router.get('/generate', function (req, res) {
    let tag = req.query.tag;
    let sql = req.query.sql;
    try {
        let shell = spawn('python3', ['dic.py', '-u', 'generate', '--tagName', tag, '--sql', sql]);
        //todo 生成数据集时的数据采集
        shell.stdout.on('end', () => {
            return res.send(JSON.stringify({success: true, message: '成功'})).end();
        });
    }catch (e) {
        return res.send(e).end();
    }
});

// 申报数据集
router.get('/declare', function (req, res) {
    let file = req.query.file;
    try {
        let shell = spawn('python3', ['dic.py', '-u', 'declare', "--file", file]);
        //todo 结果处理
        shell.stdout.on('end', () => {
            return res.send(JSON.stringify({success: true, message: '成功'})).end();
        });
    }catch (e) {
        return res.send(e).end();
    }
});

// 提交数据集
router.get('/impact', function (req, res) {
    let file = req.query.file;
    let salt = req.query.salt;
    let encryptCol = req.query.encrypt_col;
    let unencryptCol = req.query.unencrypt_col;
    let job = req.query.job;
    try {
        let shell = spawn('python3', ['dic.py', '-u', 'impact', "--file", file, "--salt", salt, "--encryptedColumn", encryptCol, "--unencryptedColumn", unencryptCol, "--job", job]);
        //todo 结果处理
        shell.stdout.on('end', () => {
            return res.send(JSON.stringify({success: true, message: '成功'})).end();
        });
    }catch (e) {
        return res.send(e).end();
    }
});

// 返回默认配置及所有配置
router.get('/setting/list', function (req, res) {
    let filePath = './settings';
    fs.readdir(filePath, function (err, files) {
        if (err){
            return res.send().end()
        }else{
            let settings = [];
            files.pop('settings.yaml');
            files.forEach(function(filename){
                let setting = filename.split('-');
                settings.push(setting[1].split('.')[0])
            });
            settings.remove(settings.indexOf('base'));
            let data = YAML.parse(fs.readFileSync(filePath+'/settings.yaml').toString());
            let re = JSON.stringify({success: true, default: data['settingsActive'], settings: settings});
            return res.send(re).end()
        }
    })
});

// 修改默认配置
router.get('/setting/edit', function (req, res) {
    let active = req.query.active;
    fs.writeFileSync('./settings/settings.yaml', 'settingsActive: \'' + active + '\'');
    return res.end()
});

// 生成配置文件
router.get('/setting/new', function (req, res) {
    let setting = req.query.setting;
    let file = req.query.file;
    fs.writeFile('./settings/settings-'+file+'.yaml', YAML.dump(setting), function (err) {
        if (err) return res.send(JSON.stringify({success: false})).end();
        return res.send(JSON.stringify({success: true})).end();
    });
});
module.exports = router;
