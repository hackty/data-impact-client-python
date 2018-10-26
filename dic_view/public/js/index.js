
$(function () {
    show_settings();
    getValueMap();
});

$('body').on('change', '#select-setting', function () {
    const s = $('#select-setting').val();
    if (s.length >= 1) editSetting(s);
    dtLocal.settings()[0].ajax.data = {"setting": s};
    show_message('switch_config', type.info, s);
    dtLocal.ajax.reload();
});

$('body').on('change', '#switch-lan', function () {
    const s = $('#switch-lan').val();
    switch_lan(s);
    edit_lan(s);
    dtLocal.ajax.reload(null, false);
});

$('body').on('click', '#start-generate', function () {
    show_message('generating', type.loading);
    generateData()
});

$('body').on('click', '#start-impact', function () {
    show_message('linking', type.loading, select_file);
    impactData()
});

$('body').on('click', '#start-setting', function () {
    show_message('creating_config', type.loading);
    createSetting()
});

/**
 * 显示配置列表名
 */
function show_settings(refresh=true) {
    listSetting((status, data)=>{
            if (status === 'success') {
                data = JSON.parse(data);
                if (data['success']) {
                    let t = '';
                    let settings = data['settings'];
                    let select = data['default'];
                    for (let i = 0; i < settings.length; i++) {
                        let file = settings[i];
                        if (file === select) {
                            t = t + '<option class="setting-option" selected = "selected">' + file + '</option>'
                        } else {
                            t = t + '<option class="setting-option">' + file + '</option>'
                        }
                    }
                    t === '' ? '<option>'+getTrueValue('dft_opt_btn')+'</option>' : $('#select-setting').html(t);
                }
                if (refresh)show_data_table();
            }
        });
}

/**
 * 获取配置名列表
 * @param finish
 */
function listSetting(finish) {
    $.ajax({
        type: 'get',
        url: '/setting/list',
        data: {},
        timeout: 20000,
        success: function (data) {
            if (finish) finish('success', data)
        },
        error: function () {
            if (finish) finish('error', [])
        }
    })
}

/**
 * 修改总配置
 * @param setting
 * @param finish
 */
function editSetting(setting, finish) {
    $.ajax({
        type: 'get',
        url: '/setting/edit',
        data: {active: setting},
        timeout: 20000,
        success: function () {
            if (finish) finish('success')
        },
        error: function () {
            if (finish) finish('error')
        }
    })
}

function show_lan() {
    let lans = Object.keys(valueMap);
    let t = '';
    for (let i = 1; i < lans.length; i++) {
        let lan = lans[i];
        if (lan === valueMap['default']) {
            t = t + '<option class="lan-option" selected = "selected">' + lan + '</option>'
        } else {
            t = t + '<option class="lan-option">' + lan + '</option>'
        }
        t === '' ? '' : $('#switch-lan').html(t);
    }
}

function edit_lan(lan, finish) {
    $.ajax({
        type: 'get',
        url: '/lan/edit',
        data: {lan: lan},
        timeout: 20000,
        success: function () {
            if (finish) finish('success')
        },
        error: function () {
            if (finish) finish('error')
        }
    })
}

let dtLocal, select_file;
function show_data_table() {
    dtLocal = $('#listLocal').DataTable( {
        "language": {
            "searchPlaceholder": 'keyword'
        },
        "processing": true,
        "serverSide": true,
        "searching": true,
        "ordering": false,
        "ajax": {
            "url": "/list",
            "data": {
                "setting": $('#select-setting').val()
            }
        },
        "columns": [
            {
                "data": function(obj) {
                    return obj.no;
                }
            },
            {
                "data": function(obj) {
                    return obj.tag;
                }
            },
            {
                "data": function(obj) {
                    return formatDateTime(Number(obj.no));
                }
            },
            {
                "data": function(obj) {
                    return getTrueValue(obj.status);
                }
            },
            {
                "class":          "data-declare",
                "orderable":      false,
                "data":           null,
                "defaultContent": ""
            },
            {
                "class":          "data-impact",
                "orderable":      false,
                "data":           null,
                "defaultContent": ""
            },
            {
                "class":          "data-delete",
                "orderable":      false,
                "data":           null,
                "defaultContent": ""
            }
        ]
    });
    $('#listLocal tbody').on( 'click', 'tr td.data-declare', function () {
        var tr = $(this).closest('tr');
        var row = dtLocal.row(tr);
        if(row.data().status === 'generating'){
            show_message('err_no_such_file', type.warning)
        }else {
            select_file = row.data().no;
            declareData();
            show_message('reporting', type.loading)
        }
    });
    $('#listLocal tbody').on( 'click', 'tr td.data-impact', function () {
        var tr = $(this).closest('tr');
        var row = dtLocal.row(tr);
        if(row.data().status !== 'info_declare'){
            show_message('err_no_declare', type.warning, row.data().no)
        }else {
            select_file = row.data().no;
            $('#impactModal').modal('show');
        }
    });
    $('#listLocal tbody').on( 'click', 'tr td.data-delete', function () {
        var tr = $(this).closest('tr');
        var row = dtLocal.row(tr);
        select_file = row.data().no;
        deleteData();
        show_message('deleting', type.loading, select_file)
    });
}

function deleteData() {
    var tmp = select_file;
    $.ajax({
        type: 'get',
        url: '/clear',
        data: {file: tmp},
        timeout: 20000,
        success: function (data) {
            var d = JSON.parse(data);
            var message = d['message'].split('\n')[0].split(':');
            if (message[0] === getTrueValue('info_clear'))show_message(message, type.info);
            else show_message(message, type.error);
            dtLocal.ajax.reload(null, false);
        },
        error: function () {
            show_message('err_clear', type.error, tmp);
        },
        complete: function () {

        }
    })
}

function declareData() {
    var tmp = select_file;
    $.ajax({
        type: 'get',
        url: '/declare',
        data: {file: tmp},
        timeout: 20000,
        success: function (data) {
            var d = JSON.parse(data);
            var message = d['message'].split('\n')[0].split(':');
            if (message[0] === getTrueValue('info_declare'))show_message(message, type.info);
            else show_message(message, type.error);
            dtLocal.ajax.reload(null, false);
        },
        error: function () {
            show_message('err_declare', type.error, tmp);
        },
        complete: function () {

        }
    })
}

function generateData() {
    let tag = $('#tag-name').val();
    let sql = $('#sql').val();
    $.ajax({
        type: 'get',
        url: '/generate',
        data: {tag: tag, sql: sql},
        timeout: 20000,
        success: function (data) {
            var d = JSON.parse(data);
            var message = d['message'].split('\n')[0].split(':');
            if (message[0] === getTrueValue('generated')) show_message(message, type.info);
            else show_message(message, type.error);
            dtLocal.ajax.reload(null, false)
        },
        error: function () {
            show_message('err_generate', type.error);
        },
        complete: function () {

        }
    })
}

function impactData() {
    let salt = $('#salt').val();
    let encrypt_col = $('#encrypted-column').val();
    let unencrypt_col = $('#unencrypted-column').val();
    let job = $('#job-id').val();
    var tmp = select_file;
    $.ajax({
        type: 'get',
        url: '/impact',
        data: {salt: salt, encrypt_col: encrypt_col, unencrypt_col: unencrypt_col, job: job, file: tmp},
        timeout: 20000,
        success: function (data) {
            var d = JSON.parse(data);
            var message = d['message'].split('\n')[0].split(':');
            if (message[0] === getTrueValue('info_impact')) show_message(message, type.info);
            else show_message(message, type.error);
            dtLocal.ajax.reload(null, false)
        },
        error: function () {
            show_message('err_impact', type.error, tmp);
        },
        complete: function () {

        }
    })
}

function createSetting() {
    let tag_owner   = $('#tag-owner').val();
    let tag_password= $('#tag-password').val();
    let host        = $('#host').val();
    let db_user     = $('#db-user').val();
    let db_password = $('#db-password').val();
    let database    = $('#database').val();
    let file        = $('#file').val();
    let setting = {sourceType: 'mysql', settingBase: 'base', tagOwner: tag_owner, tagPassword: tag_password, host: host,
        dbUser: db_user, dbPassword: db_password, database: database};
    $.ajax({
        type: 'get',
        url: '/setting/new',
        data: {setting: setting, file: file},
        timeout: 20000,
        success: function (data) {
            var d = JSON.parse(data);
            if (d['success']) {
                show_message('info_create_config', type.info, file);
                show_settings(false)
            }
            else show_message('err_create_config', type.error, file);
        },
        error: function () {
            show_message('err_create_config', type.error, file);
        },
        complete: function () {

        }
    })
}

let count = 0;
let message = [];
function show_message(var1, type, var2){
    let tmp = count;
    let content;
    if (var2 === undefined) content = getTrueValue(var1);
    else content = getTrueValue(var1) + ': ' + getTrueValue(var2);
    message.push({count: count, type: type});
    var tipsDiv = '<div class="tipsClass'+count+'">' + getTrueValue(content) + '</div>';
    $('body').append(tipsDiv);
    reload();
    setTimeout(function(){
        $('.tipsClass'+tmp).fadeOut();
        for (let i = 0; i < message.length; i++)
            if(message[i].count === tmp) {
                message.splice(i, 1);
                break
            }
        reload()
    },(5 * 1000));
    count++
}

let type = {
    info : '#228B22',
    loading : '#4F94CD',
    warning : '#EEEE00',
    error : '#EE3B3B',
};

function reload(){
    //窗口的宽度
    var windowWidth  = $(window).width();
    for (let i = 0; i < message.length; i++) {
        let tmp = message[i];
        var d = '.tipsClass'+tmp.count;
        $(d).css({
            // 'z-index'   : 100,
            'top'       : (i * 40 + 10) + 'px',
            'left'      : ( windowWidth / 2 ) - 350/2 + 'px',
            'position'  : 'fixed',
            'padding'   : '3px 5px',
            'background': tmp.type,
            'font-size' : 16 + 'px',
            'margin'    : '0 auto',
            'text-align': 'center',
            'width'     : '350px',
            'height'    : 'auto',
            'color'     : '#fff',
            'opacity'   : '0.8'
        }).show();
    }
}

let valueMap;
function getTrueValue(name) {
    if (valueMap === undefined){
        getValueMap();
        return name
    }else {
        if (valueMap[lan] === undefined) lan = valueMap['default'];
        let value = valueMap[lan][name];
        if (value === undefined) return name;
        else return value
    }
}

function getValueMap() {
    $.ajax({
        type: 'get',
        url: '/get_lan',
        data: {},
        timeout: 20000,
        success: function (data) {
            valueMap = JSON.parse(data);
            show_lan();
            switch_lan()
        }
    })
}

let lan;
let id_list = ['tab_title', 'title', 'gen_data_btn', 'gen_cfg_btn', 'select_cfg_tx', 'table_title',
    'no', 'tag', 'crt_time', 'status', 'declare_tx', 'impact_tx','impactModalLabel', 'delete_tx',
    'gen_label', 'en_col_label', 'uen_col_label', 'salt_label', 'impact_cancel_btn', 'start-impact',
    'job_label', 'generateModalLabel', 'tag_name_label', 'sql_label', 'generate_cancel_btn',
    'start-generate', 'settingModalLabel', 'tag_owner_label', 'tag_pwd_label', 'host_label',
    'db_user_label', 'db_pwd_label', 'db_label', 'file_label', 'cfg_cancle_btn', 'start-setting'];
function switch_lan(l) {
    lan = l;
    for (let i = 0; i < id_list.length; i++) {
        document.getElementById(id_list[i]).innerHTML = getTrueValue(id_list[i], l)
    }
}