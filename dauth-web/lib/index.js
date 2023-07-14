"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("./const");
var utils_1 = require("./utils");
// @ts-ignore
var http_1 = require("./http");
var WalletManager = function () {
    var localData = {
        address: '',
        loginInfo: {
            type: '',
            clientId: '',
            authUrl: '',
            redirectUri: '',
        },
        configInfo: {
            appId: '',
            appKey: '',
            urlForAppServerKeyToSubmit: '',
        },
    };
    var initSDK = function (data) {
        localData.configInfo = data;
        return Promise.resolve({
            data: null,
            msg: 'success',
            error: 0,
        });
    };
    var queryWalletAddress = function () {
        return Promise.resolve({
            data: localData.address,
            msg: 'success',
            error: 0,
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
    var checkLoginRedirctUrl = function (url) { return __awaiter(void 0, void 0, void 0, function () {
        var checkUrL, code, signStr, data, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    checkUrL = url ? url : window.location.href;
                    code = (0, utils_1.getAuthMsgByUrl)(checkUrL);
                    if (!code)
                        return [2 /*return*/, Promise.reject({
                                data: 'null',
                                msg: 'success',
                                error: 0,
                            })];
                    signStr = (0, utils_1.getMD5Str)({
                        code: code,
                        user_type: 110,
                    });
                    data = {
                        code: code,
                        user_type: 110,
                        sign: signStr,
                    };
                    return [4 /*yield*/, http_1.Http.post('https://api-dev.infras.online/account/v1/sociallogin/webexchangedtoken', data, {
                            headers: {
                                client_id: '1bfe5bbf619681e49cdc62d07badc4cb',
                            },
                        })];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, Promise.resolve({
                            data: response,
                            msg: 'success',
                            error: 0,
                        })];
            }
        });
    }); };
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
        localData: localData,
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
        checkLoginRedirctUrl: checkLoginRedirctUrl,
        bindPhone: bindPhone,
        bindEmail: bindEmail,
        queryAccountByEmail: queryAccountByEmail,
        queryAccountByAuthId: queryAccountByAuthId,
        setPassword: setPassword,
        setRecoverPassword: setRecoverPassword,
        createWallet: createWallet,
        requestRecover: requestRecover,
        estimateGas: estimateGas,
    };
};
exports.default = WalletManager();
