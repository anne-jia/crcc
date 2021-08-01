(function (win) {
  // eslint-disable-next-line no-useless-escape
  var regUrl = new RegExp('https?:\/\/[^\/]*\/?','i');
  var url = window.location.href;
  win.BASE_URL = regUrl.exec(url) + ''; // 转化字符串
  // win.BASE_URL = "http://localhost:9090/"
  // win.BASE_URL = "http://172.16.96.106.:9090/"
  //win.BASE_URL = "http://172.16.96.181.:9050/"
  win.CLIENT_URL = window.BASE_URL + 'strategic-purchase-manage';
  // win.CLIENT_URL = window.BASE_URL + 'strategic-purchase-manage1';

  //根据用户身份是否失效，判断是否已经出现过弹窗的状态
  win.IS_SHOW_SESSION_INVALID = false;
})(window)
