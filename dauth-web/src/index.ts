import { AUTH_URL } from "./const";
import { visitAuthUrl, getAuthMsgByUrl, getMD5Str } from "./utils";
import {
  CommonResponse,
  IWalletManager,
  ILocalData,
  ILoginInfo,
  IInitConfig,
  IAuthRegister,
  IAuthLogin,
  IAuthSmsCode,
  IAuthEmailCode,
  IAuthSmsBind,
  IAuthEmailBind,
  IAuthEmailUserInfo,
  IAuthIdUserInfo,
  IAuthSetPass,
  IAuthRecoverPass,
  ICreateWallet,
  IRecoverkey,
  IEstimateGas
} from "./type";
// @ts-ignore
import { Http } from "./http";

const WalletManager = (): IWalletManager => {
  const localData: ILocalData = {
    address: "",
    loginInfo: {
      type: "",
      clientId: "",
      authUrl: "",
      redirectUri: ""
    },
    configInfo: {
      appId: "",
      appKey: "",
      urlForAppServerKeyToSubmit: ""
    }
  };

  const initSDK = (data: IInitConfig): Promise<CommonResponse<null>> => {
    localData.configInfo = data;
    return Promise.resolve({
      data: null,
      msg: "success",
      error: 0
    });
  };

  const queryWalletAddress = (): Promise<CommonResponse<string>> => {
    return Promise.resolve({
      data: localData.address,
      msg: "success",
      error: 0
    });
  };

  const queryWalletBalance = () => {};

  const link2EOAWallet = () => {};

  const logout = () => {};

  const createDAuthAccount = (data: IAuthRegister) => {};

  const loginByMobileOrEmail = (data: IAuthLogin) => {};

  const sendPhoneVerifyCode = (data: IAuthSmsCode) => {};

  const sendEmailVerifyCode = (data: IAuthEmailCode) => {};

  const loginWithType = (data: ILoginInfo) => {
    if (!data.authUrl) {
      data.authUrl = (AUTH_URL as any)[data.type];
    }
    localData.loginInfo = data;
    visitAuthUrl(localData.loginInfo as any);
  };

  const checkLoginRedirctUrl = async (url?: string): Promise<CommonResponse<any>> => {
    const checkUrL = url ? url : window.location.href;
    const code = getAuthMsgByUrl(checkUrL);
    if (!code) return Promise.reject({
      data: 'null',
      msg: "success",
      error: 0
    });
    const signStr = getMD5Str({
      code,
      user_type: 110
    });
    const data = {
      code,
      user_type: 110,
      sign: signStr
    };
    const response = await Http.post(
      "https://api-dev.infras.online/account/v1/sociallogin/webexchangedtoken",
      data,
      {
        headers: {
          client_id: "1bfe5bbf619681e49cdc62d07badc4cb",
        }
      }
    );
    return Promise.resolve({
      data: response,
      msg: "success",
      error: 0
    });
  };

  const bindPhone = (data: IAuthSmsBind) => {};

  const bindEmail = (data: IAuthEmailBind) => {};

  const queryAccountByEmail = (data: IAuthEmailUserInfo) => {};

  const queryAccountByAuthId = (data: IAuthIdUserInfo) => {};

  const setPassword = (data: IAuthSetPass) => {};

  const setRecoverPassword = (data: IAuthRecoverPass) => {};

  const createWallet = (data: ICreateWallet) => {};

  const requestRecover = (data: IRecoverkey) => {};

  const estimateGas = (data: IEstimateGas) => {};

  return {
    localData,
    initSDK,
    queryWalletAddress,
    queryWalletBalance,
    link2EOAWallet,
    logout,
    createDAuthAccount,
    loginByMobileOrEmail,
    sendPhoneVerifyCode,
    sendEmailVerifyCode,
    loginWithType,
    checkLoginRedirctUrl,
    bindPhone,
    bindEmail,
    queryAccountByEmail,
    queryAccountByAuthId,
    setPassword,
    setRecoverPassword,
    createWallet,
    requestRecover,
    estimateGas
  };
};

export default WalletManager() as IWalletManager;
