
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
        declareData()
    });
    $('#listLocal tbody').on( 'click', 'tr td.data-impact', function () {
        var tr = $(this).closest('tr');
        var row = dtLocal.row(tr);
        select_file = row.data().no;
        $('#impactModal').modal('show');
    });
    $('#listLocal tbody').on( 'click', 'tr td.data-delete', function () {
        var tr = $(this).closest('tr');
        var row = dtLocal.row(tr);
        select_file = row.data().no;
        deleteData()
    });
}

function deleteData() {
    $.ajax({
        type: 'get',
        url: '/clear',
        data: {file: select_file},
        timeout: 20000,
        success: function () {
            show_message('clear success');
            dtLocal.ajax.reload(null, false);
        },
        error: function () {
            show_message('clear error');
        }
    })
}

function declareData() {
    $.ajax({
        type: 'get',
        url: '/declare',
        data: {file: select_file},
        timeout: 20000,
        success: function () {
            show_message('declare success');
            dtLocal.ajax.reload(null, false);
        },
        error: function () {
            show_message('declare error');
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
            show_message('generate success');
            dtLocal.ajax.reload(null, false)
        },
        error: function () {
            show_message('generate error');
        }
    })
}

function impactData() {
    let salt = $('#salt').val();
    let col = $('#col-name').val();
    let job = $('#job-id').val();
    $.ajax({
        type: 'get',
        url: '/impact',
        data: {salt: salt, col: col, job: job, file: select_file},
        timeout: 20000,
        success: function () {
            show_message('impact success');
            dtLocal.ajax.reload(null, false)
        },
        error: function () {
            show_message('impact error');
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
    let setting = {settingBase: 'base', tagOwner: tag_owner, tagPassword: tag_password, host: host, dbUser: db_user,
        dbPassword: db_password, database: database};
    $.ajax({
        type: 'get',
        url: '/setting/new',
        data: {setting: setting, file: file},
        timeout: 20000,
        success: function (data) {
            if (data['success']) {
                show_message('create setting success');
                show_settings(false)
            }
            else show_message('create setting error');
        },
        error: function () {
            show_message('create setting error');
        }
    })
}

function show_message(content) {
    console.log(content)
}