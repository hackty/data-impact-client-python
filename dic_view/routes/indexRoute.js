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
    let lan = YAML.parse(fs.readFileSync('lan.yaml').toString());
    let l = [];
    for (let i = 0; i < list.length; i++) {
        let k = 0;
        let tmp = list[i].split('|');
        for (let j = 0; j < keywords.length; j++)
            if (list[i].indexOf(keywords[j])!==-1 ||
                formatDateTime(Number(tmp[0])).indexOf(keywords[j])!==-1 ||
                (lan[lan['default']][tmp[3]]).indexOf(keywords[j])!==-1) k++;
        if (k === keywords.length) {
            let d = {no: tmp[0], tag: tmp[2], status: tmp[3]};
            l.push(d);
        }
    }
    let data = [];
    for (let i = 0; i + start < l.length && i < length; i++) data.push(l[i+start])
    return res.send({draw: draw, data: data, recordsTotal:l.length, recordsFiltered: l.length}).end();
});

function formatDateTime(timeStamp) {
    var date = new Date(timeStamp);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
}

function runShell(shell, res){
    try {
        let d;
        shell.stdout.on('data',(data) => {
            d = data.toString();
        });
        shell.stdout.on('end', () => {
            return res.send(JSON.stringify({success: true, message: d})).end();
        });
    }catch (e) {
        return res.send(e).end();
    }
}

// 清除数据集
router.get('/clear', function (req, res) {
    let file = req.query.file;
    let shell = spawn('python3', ['dic.py', '-u', 'clear', "--file", file]);
    return runShell(shell, res)
});

// 生成数据集
router.get('/generate', function (req, res) {
    let tag = req.query.tag;
    let sql = req.query.sql;
    let shell = spawn('python3', ['dic.py', '-u', 'generate', '--tagName', encodeURI(tag), '--sql', sql]);
    runShell(shell, res)
});

// 申报数据集
router.get('/declare', function (req, res) {
    let file = req.query.file;
    let shell = spawn('python3', ['dic.py', '-u', 'declare', "--file", file]);
    runShell(shell, res)
});

// 提交数据集
router.get('/impact', function (req, res) {
    let file = req.query.file;
    let salt = req.query.salt;
    let encryptCol = req.query.encrypt_col;
    let unencryptCol = req.query.unencrypt_col;
    let job = req.query.job;
    let shell = spawn('python3', ['dic.py', '-u', 'impact', "--file", file, "--salt", salt, "--encryptedColumn", encryptCol, "--unencryptedColumn", unencryptCol, "--job", job]);
    runShell(shell, res)
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
                if (setting[0]==='settings'&&setting[1]!==undefined)
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
        let active = YAML.parse(fs.readFileSync('./settings/settings.yaml').toString());
        if (active.settingsActive === '')
            fs.writeFileSync('./settings/settings.yaml', 'settingsActive: \'' + file + '\'');
        return res.send(JSON.stringify({success: true})).end();
    });
});

// 返回语言配置
router.get('/get_lan', function (req, res) {
    let lan = YAML.parse(fs.readFileSync('lan.yaml').toString());
    let re = JSON.stringify(lan);
    return res.send(re).end();
});

router.get('/lan/edit', function (req, res) {
    let lan = req.query.lan;
    let lans = YAML.parse(fs.readFileSync('lan.yaml').toString());
    lans['default'] = lan;
    fs.writeFileSync('lan.yaml', YAML.stringify(lans));
    return res.end();
});
module.exports = router;
