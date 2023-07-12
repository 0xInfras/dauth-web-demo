"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthMsgByUrl = exports.visitAuthUrl = exports.getQueryString = exports.getQueryStringByStr = void 0;
// 获取url #后面的参数
var getQueryStringByStr = function (name, str) {
    var query_string = str; // window.location.hash
    if (!query_string)
        return null; // 如果无参，返回null
    var reg = /[?&]?([^=]+)=([^&]*)/g;
    var tokens;
    while (tokens = reg.exec(query_string)) {
        if (decodeURIComponent(tokens[1]) === name) {
            return decodeURIComponent(tokens[2]);
        }
    }
    return null;
};
exports.getQueryStringByStr = getQueryStringByStr;
// 获取 url 参数
var getQueryString = function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    var context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
};
exports.getQueryString = getQueryString;
var visitAuthUrl = function (_a) {
    var clientId = _a.clientId, redirectUri = _a.redirectUri, authUrl = _a.authUrl;
    window.open("".concat(authUrl, "&redirect_uri=").concat(redirectUri, "&client_id=").concat(clientId), '_self');
};
exports.visitAuthUrl = visitAuthUrl;
var getAuthMsgByUrl = function (callbackUrl) {
    var authMsg = '';
    var twitterUrl = new URL(window.location);
    console.log('twitterUrl', twitterUrl);
    if (twitterUrl.searchParams.has('code')) {
        authMsg = getQueryString('code');
    }
    console.log('authMsg', authMsg);
    return authMsg;
};
exports.getAuthMsgByUrl = getAuthMsgByUrl;
