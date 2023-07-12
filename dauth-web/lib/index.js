"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("./const");
var utils_1 = require("./utils");
var WalletManager = function () {
    var localData = {
        address: '',
        loginInfo: {
            type: '',
            clientId: '',
            authUrl: '',
            redirectUri: ''
        },
        configInfo: {
            appId: '',
            appKey: '',
            urlForAppServerKeyToSubmit: ''
        }
    };
    var initSDK = function (data) {
        localData.configInfo = data;
        return Promise.resolve({
            data: null,
            msg: 'success',
            error: 0
        });
    };
    var queryWalletAddress = function () {
        return Promise.resolve({
            data: localData.address,
            msg: 'success',
            error: 0
        });
    };
    var queryWalletBalance = function () { };
    var link2EOAWallet = function () { };
    var logout = function () { };
    var createDAuthAccount = function (data) { };
    var loginByMobileOrEmail = function (data) { };
    var sendPhoneVerifyCode = function (data) { };
    var sendEmailVerifyCode = function (data) { };
    var loginWithType = function (data) {
        if (!data.authUrl) {
            data.authUrl = const_1.AUTH_URL[data.type];
        }
        localData.loginInfo = data;
        (0, utils_1.visitAuthUrl)(localData.loginInfo);
    };
    var loginWithType2 = function () {
        var message = (0, utils_1.getAuthMsgByUrl)(window.location.href);
        console.log('message', message);
    };
    var bindPhone = function (data) { };
    var bindEmail = function (data) { };
    var queryAccountByEmail = function (data) { };
    var queryAccountByAuthId = function (data) { };
    var setPassword = function (data) { };
    var setRecoverPassword = function (data) { };
    var createWallet = function (data) { };
    var requestRecover = function (data) { };
    var estimateGas = function (data) { };
    return {
        initSDK: initSDK,
        queryWalletAddress: queryWalletAddress,
        queryWalletBalance: queryWalletBalance,
        link2EOAWallet: link2EOAWallet,
        logout: logout,
        createDAuthAccount: createDAuthAccount,
        loginByMobileOrEmail: loginByMobileOrEmail,
        sendPhoneVerifyCode: sendPhoneVerifyCode,
        sendEmailVerifyCode: sendEmailVerifyCode,
        loginWithType: loginWithType,
        loginWithType2: loginWithType2,
        bindPhone: bindPhone,
        bindEmail: bindEmail,
        queryAccountByEmail: queryAccountByEmail,
        queryAccountByAuthId: queryAccountByAuthId,
        setPassword: setPassword,
        setRecoverPassword: setRecoverPassword,
        createWallet: createWallet,
        requestRecover: requestRecover,
        estimateGas: estimateGas
    };
};
exports.default = WalletManager();
