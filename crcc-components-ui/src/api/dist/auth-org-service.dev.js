"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var authOrgService = {
  /**
   * 根据工作事项code获取被授权组织树
   * @param bizOpCode  工作事项code
   * @returns {AxiosPromise}
   */
  getHasAuthOrgTreeRealtime: function getHasAuthOrgTreeRealtime(bizOpCode) {
    return window.axios({
      url: "".concat(window.CLIENT_URL, "/authOrg/tree/realtime/").concat(bizOpCode, "/1"),
      method: 'get'
    });
  },
  getHasAuthOrgChildsRealTime: function getHasAuthOrgChildsRealTime(authOrgChildQuery) {
    return window.axios({
      url: "".concat(window.CLIENT_URL, "/authOrg/tree/hasAuthOrgs/child"),
      method: 'post',
      data: authOrgChildQuery
    });
  }
};
var _default = authOrgService;
exports["default"] = _default;