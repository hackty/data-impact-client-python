
$(function () {
    show_settings();
});

$('body').on('change', '#select-setting', function () {
    const s = $('#select-setting').val();
    if (s.length >= 1) editSetting(s);
    dtLocal.settings()[0].ajax.data = {"setting": s};
    dtLocal.ajax.reload();
});

$('body').on('click', '#start-generate', function () {
    generateData()
});

$('body').on('click', '#start-impact', function () {
    impactData()
});

$('body').on('click', '#start-setting', function () {
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
                    t === '' ? '' : $('#select-setting').html(t);
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

let dtLocal, select_file;
function show_data_table() {
    dtLocal = $('#listLocal').DataTable( {
        "language": {
            "searchPlaceholder": "关键字"
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
                    return obj.status;
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
        select_file = row.data().no;
        declareData();
        show_message('start declare', type.loading)
    });
    $('#listLocal tbody').on( 'click', 'tr td.data-impact', function () {
        var tr = $(this).closest('tr');
        var row = dtLocal.row(tr);
        if(row.data().status !== '申报完成'){
            show_message('must declare', type.warning)
        }else {
            select_file = row.data().no;
            $('#impactModal').modal('show');
            show_message('start impact', type.loading)
        }
    });
    $('#listLocal tbody').on( 'click', 'tr td.data-delete', function () {
        var tr = $(this).closest('tr');
        var row = dtLocal.row(tr);
        select_file = row.data().no;
        deleteData();
        show_message('start delete', type.loading)
    });
}

function deleteData() {
    $.ajax({
        type: 'get',
        url: '/clear',
        data: {file: select_file},
        timeout: 20000,
        success: function () {
            show_message('clear success', type.info);
            dtLocal.ajax.reload(null, false);
        },
        error: function () {
            show_message('clear error', type.error);
        },
        complete: function () {

        }
    })
}

function declareData() {
    $.ajax({
        type: 'get',
        url: '/declare',
        data: {file: select_file},
        timeout: 20000,
        success: function (data) {
            var d = JSON.parse(data);
            var message = d['message'].split(':')[0];
            if (message === '申报完成'){
                show_message('declare success', type.info);
                dtLocal.ajax.reload(null, false);
            }else{
                show_message(message, type.error);
            }
        },
        error: function () {
            show_message('declare error', type.error);
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
        success: function () {
            show_message('generate success', type.info);
            dtLocal.ajax.reload(null, false)
        },
        error: function () {
            show_message('generate error', type.error);
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
    $.ajax({
        type: 'get',
        url: '/impact',
        data: {salt: salt, encrypt_col: encrypt_col, unencrypt_col: unencrypt_col, job: job, file: select_file},
        timeout: 20000,
        success: function () {
            show_message('impact success', type.info);
            dtLocal.ajax.reload(null, false)
        },
        error: function () {
            show_message('impact error', type.error);
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
                show_message('create setting success', type.info);
                show_settings(false)
            }
            else show_message('create setting error', type.error);
        },
        error: function () {
            show_message('create setting error', type.error);
        },
        complete: function () {

        }
    })
}

let count = 0;
let message = [];
function show_message(content, type){
    var tmp = count;
    message.push({count: count, content:content, type: type});
    var tipsDiv = '<div class="tipsClass'+count+'">' + content + '</div>';
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
    info : '#66CD00',
    loading : '#B2DFEE',
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
            'top'       : (i * 40 + 10) + 'px',
            'left'      : ( windowWidth / 2 ) - 350/2 + 'px',
            'position'  : 'absolute',
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