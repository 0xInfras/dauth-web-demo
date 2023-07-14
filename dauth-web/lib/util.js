"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthMsgByUrl = exports.visitAuthUrl = exports.getQueryString = exports.getQueryStringByStr = void 0;
// 获取url #后面的参数
const getQueryStringByStr = (name, str) => {
    let query_string = str; // window.location.hash
    if (!query_string)
        return null; // 如果无参，返回null
    let reg = /[?&]?([^=]+)=([^&]*)/g;
    let tokens;
    while (tokens = reg.exec(query_string)) {
        if (decodeURIComponent(tokens[1]) === name) {
            return decodeURIComponent(tokens[2]);
        }
    }
    return null;
};
exports.getQueryStringByStr = getQueryStringByStr;
// 获取 url 参数
const getQueryString = (name) => {
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
const visitAuthUrl = ({ clientId, redirectUri, authUrl }) => {
    window.open(`${authUrl}&redirect_uri=${redirectUri}&client_id=${clientId}`, '_self');
};
exports.visitAuthUrl = visitAuthUrl;
const getAuthMsgByUrl = (callbackUrl) => {
    let authMsg = '';
    const twitterUrl = new URL(window.location);
    console.log('twitterUrl', twitterUrl);
    if (twitterUrl.searchParams.has('code')) {
        authMsg = getQueryString('code');
    }
    console.log('authMsg', authMsg);
    return authMsg;
};
exports.getAuthMsgByUrl = getAuthMsgByUrl;
