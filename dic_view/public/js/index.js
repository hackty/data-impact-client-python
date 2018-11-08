
$(function () {
    getValueMap();
});

$('body').on('change', '#select-setting', function () {
    const s = $('#select-setting').val();
    if (s.length >= 1) editSetting(s);
    edit_setting(s);
});

function edit_setting(s){
    dtLocal.settings()[0].ajax.data = {"setting": s};
    show_message('switch_config', type.info, s);
    dtLocal.ajax.reload();
}

$('body').on('change', '#switch-lan', function () {
    const s = $('#switch-lan').val();
    switch_lan(s);
    edit_lan(s);
    dtLocal.ajax.reload(null, false);
});

$('body').on('click', '#detail_accept_btn', function () {
    $('#impactModal').modal('show');
});

$('body').on('click', '#start-generate', function () {
    generateData('mysql')
});

$('body').on('click', '#start_file_generate', function () {
    generateData('file')
});

$('body').on('click', '#start-impact', function () {
    impactData()
});

$('body').on('click', '#start-setting', function () {
    createSetting('mysql')
});

$('body').on('click', '#start_file_config', function () {
    createSetting('file')
});

function switch_gen_data(){
    if (from === 'mysql') $('#generateModal').modal('show');
    else if (from === 'file') $('#generateFileModal').modal('show');
}

let from;
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
                    from = data['from'];
                    for (let i = 0; i < settings.length; i++) {
                        let file = settings[i];
                        if (file === select) {
                            t = t + '<option class="setting-option" selected = "selected">' + file + '</option>'
                        } else {
                            t = t + '<option class="setting-option">' + file + '</option>'
                        }
                    }
                    t === '' ? t='<option>'+getTrueValue('dft_opt_btn')+'</option>' : '';
                    $('#select-setting').html(t);
                    const s = $('#select-setting').val();
                    if (s.length >= 1) editSetting(s);
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
        success: function (data) {
            data = JSON.parse(data);
            if (data['success']) {
                from = data['from'];
                if (finish) finish('success')
            } else finish('error')
        },
        error: function () {
            if (finish) finish('error')
        }
    })
}

/**
 * 显示语言
 */
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

/**
 * 修改语言
 * @param lan
 * @param finish
 */
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

/**
 * 显示数据表格
 */
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
            // {
            //     "class":          "data-impact",
            //     "orderable":      false,
            //     "data":           null,
            //     "defaultContent": ""
            // },
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
    // $('#listLocal tbody').on( 'click', 'tr td.data-impact', function () {
    //     var tr = $(this).closest('tr');
    //     var row = dtLocal.row(tr);
    //     if(row.data().status !== 'info_declare'){
    //         show_message('err_no_declare', type.warning, row.data().no)
    //     }else {
    //         select_file = row.data().no;
    //         $('#impactModal').modal('show');
    //     }
    // });
    $('#listLocal tbody').on( 'click', 'tr td.data-delete', function () {
        var tr = $(this).closest('tr');
        var row = dtLocal.row(tr);
        select_file = row.data().no;
        deleteData();
        show_message('deleting', type.loading, select_file)
    });
}

/**
 * 删除数据集
 */
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

/**
 * 申报数据集
 */
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

/**
 * 生成数据集
 */
function generateData(f) {
    let tag, da;
    if (f === 'mysql') {
        tag = $('#tag-name').val();
        let sql = $('#sql').val();
        if (sql === '' || tag === '') return show_message('warning_information', type.warning);
        da = {sql: sql};
    }else{
        tag = $('#tag_name_file').val();
        let column_name = $('#column_name').val();
        let separator = $('#separator').val();
        let source_file = $('#source_file').val();
        if (column_name === '' || tag === '' || separator === '' || source_file === '') return show_message('warning_information', type.warning);
        da = {column_name: column_name, separator: separator, source_file: source_file}
    }
    show_message('generating', type.loading);
    $.ajax({
        type: 'get',
        url: '/generate',
        data: {tag: tag, f: f, da: da},
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

/**
 * 关联数据集
 */
function impactData() {
    let salt = $('#salt').val();
    let encrypt_col = impact.encrypted_column;
    let unencrypt_col = impact.unencrypted_column;
    let job = impact.job_id;
    let tmp = select_file;
    if (salt === '' || encrypt_col === '' || job === '') return show_message('warning_information', type.warning);
    show_message('linking', type.loading, select_file);
    $.ajax({
        type: 'get',
        url: '/impact',
        data: {salt: salt, encrypt_col: encrypt_col, unencrypt_col: unencrypt_col, job: job, file: tmp},
        timeout: 20000,
        success: function (data) {
            let d = JSON.parse(data);
            let message = d['message'].split('\n')[0].split(':');
            if (message[0] === getTrueValue('info_impact')) show_message(message, type.info);
            else show_message(message, type.error);
            dtLocal.ajax.reload(null, false);
            fade_message(fetch_now, true);
        },
        error: function () {
            show_message('err_impact', type.error, tmp);
        },
        complete: function () {

        }
    })
}

/**
 * 生成配置
 */
function createSetting(f) {
    let setting, file;
    if (f === 'mysql') {
        let tag_owner   = $('#tag-owner').val();
        let tag_password= $('#tag-password').val();
        let host        = $('#host').val();
        let db_user     = $('#db-user').val();
        let db_password = $('#db-password').val();
        let database    = $('#database').val();
        file            = $('#file').val();
        if (tag_owner === '' || tag_password === '' || host === '' || db_user === '' || db_password === '' || database === '' || file === '')
            return show_message('warning_information', type.warning);
        setting = {sourceType: 'mysql', settingBase: 'base', tagOwner: tag_owner, tagPassword: tag_password, host: host,
            dbUser: db_user, dbPassword: db_password, database: database, path: './data/'+file};
    }else{
        let tag_owner   = $('#tag_owner_file').val();
        let tag_password= $('#tag_password_file').val();
        file            = $('#file_file').val();
        if (tag_owner === '' || tag_password === '' || file === '') return show_message('warning_information', type.warning);
        setting = {sourceType: 'file', settingBase: 'base', tagOwner: tag_owner, tagPassword: tag_password, path: './data/'+file};
    }
    show_message('creating_config', type.loading);
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
let fetch_now;
/**
 * 显示消息
 * @param var1
 * @param typ
 * @param var2
 * @param stay
 */
function show_message(var1, typ, var2, stay=5){
    let tmp = count;
    let content;
    if (var2 === undefined) content = getTrueValue(var1);
    else content = getTrueValue(var1) + ': ' + getTrueValue(var2);
    if (typ === type.with_btn) {
        fetch_now = count;
        content += '<button type="button" class="close" onclick="fade_message('+fetch_now+','+true+');">' +
                '<span aria-hidden="true" style="color: #fff;opacity: 1;">&times;</span></button>';
    }
    message.push({count: count, type: typ});
    let tipsDiv = '<div class="tipsClass'+count+'">' + content + '</div>';
    $('body').append(tipsDiv);
    reload();
    setTimeout(function(){
        fade_message(tmp, typ === type.with_btn)
    },(stay * 1000));
    count++
}

function fade_message(msg, ispoll){
    $('.tipsClass'+msg).fadeOut();
    for (let i = 0; i < message.length; i++)
        if(message[i].count === msg) {
            message.splice(i, 1);
            break
        }
    reload();
    if (ispoll) polling()
}

let type = {
    info : '#228B22',
    loading : '#4F94CD',
    warning : '#EEEE00',
    error : '#EE3B3B',
    with_btn: '#000'
};

/**
 * 重载消息
 */
function reload(){
    //窗口的宽度
    let windowWidth  = $(window).width();
    for (let i = 0; i < message.length; i++) {
        let tmp = message[i];
        let d = '.tipsClass'+tmp.count;
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
            'opacity'   : '0.9'
        }).show();
    }
}

let valueMap;

/**
 * 从语言文件获取
 * @param name
 * @returns {*}
 */
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

/**
 * 获取语言配置
 */
function getValueMap() {
    $.ajax({
        type: 'get',
        url: '/get_lan',
        data: {},
        timeout: 20000,
        success: function (data) {
            valueMap = JSON.parse(data);
            show_settings();
            show_lan();
            switch_lan();
            polling();
        }
    })
}

let lan;
let id_list = ['impact_tx','tab_title', 'title', 'gen_data_btn', 'gen_cfg_btn', 'select_cfg_tx', 'table_title', 'no', 'tag',
    'crt_time', 'status', 'declare_tx', 'impactModalLabel', 'delete_tx', 'en_col_label', 'uen_col_label',
    'salt_label', 'impact_cancel_btn', 'start-impact', 'job_label', 'generateModalLabel', 'tag_name_label', 'sql_label',
    'generate_cancel_btn', 'start-generate', 'settingModalLabel', 'tag_owner_label', 'tag_pwd_label', 'host_label',
    'db_user_label', 'db_pwd_label', 'db_label', 'file_label', 'cfg_cancel_btn', 'start-setting', 'gen_cfg_by_db',
    'gen_cfg_by_file', 'configFileModalLabel', 'tag_owner_file_label', 'tag_pwd_file_label', 'file_file_label',
    'cfg_file_cancel_btn', 'start_file_config', 'generateFileModalLabel', 'tag_name_file_label', 'column_name_label',
    'separator_label', 'source_file_label', 'generate_file_cancel_btn', 'start_file_generate', 'go_result', 'detailModalLabel',
    'detail_no_label', 'detail_tag_label', 'detail_time_label', 'detail_reject_btn', 'detail_accept_btn'];

/**
 * 切换语言
 * @param l
 */
function switch_lan(l) {
    lan = l;
    for (let i = 0; i < id_list.length; i++) {
        try {
        document.getElementById(id_list[i]).innerHTML = getTrueValue(id_list[i])
        }catch (e) {}
    }
}

let impact = {encrypted_column: '', unencrypted_column: '', job_id: ''};
function polling() {
    setTimeout(function () {
        $.ajax({
            type: 'get',
            url: '/fetch',
            data: {},
            timeout: 20000,
            success: function (data) {
                let dt = JSON.parse(data);
                if (dt['success']) {
                    let content = JSON.parse(dt['data']['content']);
                    impact.encrypted_column = content['encryptedColumn'];
                    impact.unencrypted_column = content['unencryptedColumn'];
                    impact.job_id = content['job'];
                    let t = dt['data']['sender'] +
                        '<a class="btn btn-link" onclick="get_detail('+content['file']+')">'+getTrueValue('detail')+'</a>';
                    show_message('received_request',type.with_btn,t, 1800)
                }else {
                    polling()
                }
            }
        })
    }, (10 * 1000));
}

function get_detail(file) {
    $.ajax({
        type: 'get',
        url: '/get_detail',
        data: {file: file},
        timeout: 20000,
        success: function (data) {
            if (data === "") {
                show_message('err_impact_local', type.error, file);
                fade_message(fetch_now, true)
            }else {
                let d = JSON.parse(data);
                if (d['setting'] !== $('#select-setting').val()) {
                    editSetting(d.setting);
                    $("#select-setting").val(d.setting);
                    edit_setting(d.setting);
                    d['setting'] = true;
                } else d['setting'] = false;
                show_detail(d);
            }
        }
    })
}

function show_detail(data) {
    select_file = data['no'];
    $('#detail_no').html(data['no']);
    $('#detail_tag').html(data['tag']);
    $('#detail_time').html(formatDateTime(Number(data['no'])));
    $('#detailModal').modal('show');
}