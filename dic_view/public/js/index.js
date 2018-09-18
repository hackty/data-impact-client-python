
let apiAndParam = {};

$(function () {
    show_settings();
    show_data_table();
});

// function changeSelectSetting(callback) {
//     const s = document.getElementById("InputSettings").value;
//     let setting_name = s.length >= 1 ? s : "";
//     get_settings(setting_name, callback);
// }

/**checkAll----------------------------------------*/
// 扫描所有checkbox
function syncCheckBox() {
    let all = 0;
    let ischeck = 0;
    for (let i = 0; i < apiAndParam.length; i++) {
        if (apiAndParam[i] === undefined) continue;
        all++;
        if (document.getElementById("checkbox"+i).checked) ischeck++;
    }
    checkHidden(all !== 0);
    if (all !== 0) showCheck(all === ischeck);
}

//是否显示checkAll
function checkHidden(isShow) {
    if (isShow) document.getElementById('bottom-line').style.display='block';
    else document.getElementById('bottom-line').style.display='none'
}

// checkAll状态更改
function checkAllOnChange() {
    checkAll(document.getElementById("checkAll").checked);
}

// 更改checkAll的状态
function showCheck(isCheck) {
    document.getElementById("checkAll").checked = isCheck
}

// checkAll的操作
function checkAll(isCheck) {
    for (let i = 0; i < apiAndParam.length; i++) {
        if (apiAndParam[i] === undefined) continue;
        document.getElementById("checkbox"+i).checked = isCheck
    }
}
/**----------------------------------------*/

// /**
//  * 对Json数据的可视化
//  * @param data
//  * @returns {*}
//  * @private
//  */
// function _tmp(data) {
//     try {
//         return formatJson(JSON.parse(data))
//     }catch (e) {
//         return data
//     }
// }

/**
 * 显示配置列表名
 */
function show_settings() {
    ajax_get_setting_list(undefined,
        (status, data)=>{
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
 * @param start
 * @param finish
 */
function ajax_get_setting_list(start, finish) {
    if (start) start();
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

function show_data_table() {
    const dtLocal = $('#listLocal').DataTable( {
        "language": {
            "searchPlaceholder": "编号"
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
        declareData(row.data().no, ()=>dtLocal.ajax.reload())
    });
    $('#listLocal tbody').on( 'click', 'tr td.data-impact', function () {
        var tr = $(this).closest('tr');
        var row = dtLocal.row(tr);
        $('#impactModal').modal('show');
    });
    $('#listLocal tbody').on( 'click', 'tr td.data-delete', function () {
        var tr = $(this).closest('tr');
        var row = dtLocal.row(tr);
        deleteData(row.data().no, ()=>dtLocal.ajax.reload())
    });
}

function deleteData(file, finish) {
    $.ajax({
        type: 'get',
        url: '/clear',
        data: {file: file},
        timeout: 20000,
        success: function () {
            show_message('clear success');
            finish()
        },
        error: function () {
            show_message('clear error');
            finish()
        }
    })
}
function declareData(file, finish) {
    $.ajax({
        type: 'get',
        url: '/declare',
        data: {file: file},
        timeout: 20000,
        success: function () {
            show_message('declare success');
            finish()
        },
        error: function () {
            show_message('declare error');
            finish()
        }
    })
}

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

function show_message(content) {
    console.log(content)
}