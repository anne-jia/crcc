(function (win) {
  // eslint-disable-next-line no-useless-escape
  var regUrl = new RegExp('https?:\/\/[^\/]*\/?','i');
  var url = window.location.href;
  win.BASE_URL = regUrl.exec(url) + ''; // 转化字符串
  win.CLIENT_URL = window.BASE_URL + 'crcc-mat-system-manage'
})(window)
