import { AUTH_URL } from './const'
import { visitAuthUrl,  getAuthMsgByUrl } from './utils'

import {
  CommonResponse,
  TLoginType,
  ILocalData,
  ILoginInfo,
  IInitConfig,
  IAuthRegister,
  IAuthLogin,
  IAuthSmsCode,
  IAuthEmailCode,
  IAuthThirdParty,
  IAuthSmsBind,
  IAuthEmailBind,
  IAuthEmailUserInfo,
  IAuthIdUserInfo,
  IAuthSetPass,
  IAuthRecoverPass,
  ICreateWallet,
  IRecoverkey,
  IEstimateGas
} from './type'

const WalletManager = (): any => {
  const localData: ILocalData = {
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
  }

  const initSDK = (data: IInitConfig) => {
    localData.configInfo = data
    return Promise.resolve({
      data: null,
      msg: 'success',
      error: 0
    })
  }

  const queryWalletAddress = (): Promise<CommonResponse<string>> => {
    return Promise.resolve({
      data: localData.address,
      msg: 'success',
      error: 0
    })
  }

  const queryWalletBalance = () => {}

  const link2EOAWallet = () => {}

  const logout = () => { }

  const createDAuthAccount = (data: IAuthRegister) => {}

  const loginByMobileOrEmail = (data: IAuthLogin) => {}

  const sendPhoneVerifyCode = (data: IAuthSmsCode ) => {}

  const sendEmailVerifyCode = (data: IAuthEmailCode) => {}

  const loginWithType = (data: ILoginInfo) => {
    if (!data.authUrl) {
      data.authUrl = (AUTH_URL as any)[data.type]
    } 
    localData.loginInfo = data
    visitAuthUrl(localData.loginInfo as any)
  }

  const loginWithType2 = () => {
    const message = getAuthMsgByUrl(window.location.href)
    console.log('message', message)
  }

  const bindPhone = (data: IAuthSmsBind) => {}

  const bindEmail = (data: IAuthEmailBind) => {}

  const queryAccountByEmail = (data: IAuthEmailUserInfo) => {}

  const queryAccountByAuthId = (data: IAuthIdUserInfo) => {}

  const setPassword = (data: IAuthSetPass) => {}

  const setRecoverPassword = (data: IAuthRecoverPass) => {}

  const createWallet = (data: ICreateWallet) => {}

  const requestRecover = (data: IRecoverkey) => {}

  const estimateGas = (data: IEstimateGas) => {}

  return {
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
    loginWithType2,
    bindPhone,
    bindEmail,
    queryAccountByEmail,
    queryAccountByAuthId,
    setPassword,
    setRecoverPassword,
    createWallet,
    requestRecover,
    estimateGas
  }
}

export default WalletManager()
 