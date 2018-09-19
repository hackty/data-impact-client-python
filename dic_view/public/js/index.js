
$(function () {
    show_settings();
    show_data_table();
});

$('body').on('change', '#select-setting', function () {
    const s = document.getElementById("select-setting").value;
    if (s.length >= 1) editSetting(setting_name);
});

$('body').on('click', '#start-generate', function () {
    generateData()
});
$('body').on('click', '#start-impact', function () {
    impactData()
});

/**
 * 显示配置列表名
 */
function show_settings() {
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
        "ajax": "/list",
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
    let tag = document.getElementById('tag-name').value;
    let sql = document.getElementById('sql').value;
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
    let salt = document.getElementById('salt').value;
    let col = document.getElementById('col-name').value;
    let job = document.getElementById('job-id').value;
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

function show_message(content) {
    console.log(content)
}