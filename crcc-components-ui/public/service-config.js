(function(win) {
  // eslint-disable-next-line no-useless-escape
  var regUrl = new RegExp("https?://[^/]*/?", "i");
  var url = window.location.href;
  win.BASE_URL = regUrl.exec(url) + ""; // 转化字符串
  // win.CLIENT_URL = window.BASE_URL + 'crcc-mat-system-manage';
  win.CLIENT_URL = window.BASE_URL + "crcc-expert-manage";
  win.SOURCE_URL = window.BASE_URL + 'crcc-purchase-project';
  
  //根据身份是否失效。判断是否出啊先弹窗的状态
  win.IS_SHOW_SESSION_INVALID = false;
  
})(window);
