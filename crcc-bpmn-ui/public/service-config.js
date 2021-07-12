(function(win) {
  // eslint-disable-next-line no-useless-escape
  var regUrl = new RegExp("https?://[^/]*/?", "i");
  var url = window.location.href;
  win.BASE_URL = regUrl.exec(url) + ""; // 转化字符串
  // win.BASE_URL="http://172.16.96.126:9090/"
  // win.CLIENT_URL = window.BASE_URL + "purchase/purchase-workflow-engine-server/";
  win.CLIENT_URL = window.BASE_URL + "crcc-process/";
})(window);
