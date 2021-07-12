(function (win) {
    // eslint-disable-next-line no-useless-escape
    let regUrl = /https?:\/\/[^\/]*\/?/i;
    var url = window.location.href;
    win.BASE_URL = regUrl.exec(url) + ''; // 转化字符串
    win.SYSMANAGE_URL = window.BASE_URL + 'system-manage';
    win.CAMUNDA_URL = window.BASE_URL + 'workflow-engine-server';
    window.CAMUNDA_UPLOAD_URL = window.BASE_URL + 'zuul/workflow-engine-server';
    win.linto_debug = false;
    win.use_cas = true;
})(window)

