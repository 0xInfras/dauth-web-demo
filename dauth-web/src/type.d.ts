export interface CommonResponse<T> {
  data: T;    // 响应内容
  msg: string; // 响应信息
  error: number; // 错误码
}

export type TLoginType = 'GOOGLE' | 'TWITTER' | 'FACEBOOK' | ''

export interface ILocalData {
  address: string,
  configInfo: IInitConfig
  loginInfo: ILoginInfo,
}

export interface ILoginInfo {
  type: TLoginType,
  clientId: string,
  authUrl: string,
  redirectUri?: string;
}

export interface IInitConfig {
  appId: string;
  appKey: string;
  urlForAppServerKeyToSubmit: string;
}

export interface IAuthRegister {
  account: string; // 自有账号（字母和数字组合)
  passWord: string; // 密码
  confirmPwd: string; // 确认密码
}

export interface IAuthLogin {
  account: string; // 自有账号（字母和数字组合)
  verifyCode: string; // 验证码
}

export interface IAuthSmsCode {
  phone: string; // 手机号
  areaCode: string; // 区号
}

export interface IAuthEmailCode {
  email: string; // 邮箱
}

export interface IAuthThirdParty {
  type: LoginType   
}

export interface IAuthSmsBind {
  openudid: number; // 用户id
  phone: string; // 手机号
  phone_area_code: string; // 区号
  verify_code: string; // 验证码
}

export interface IAuthEmailBind {
  email: string; // 邮箱
  verifyCode: string; // 邮箱验证码
}

export interface IAuthEmailUserInfo {
  email: string;  // 邮箱
}

export interface IAuthIdUserInfo {
  openId: string; 
}

export interface IAuthSetPass {
  passWord: string; 
}

export interface IAuthRecoverPass {
  resetPwdParams: string; 
}

export interface ICreateWallet {
  passcode: string; 
}

export interface IRecoverkey {
  passcode: string; // 秘钥的保护密码
  appServerKey: string; // app服务端秘钥
}

export interface IEstimateGas {
  toUserId: string; // 目标账号
  amount: number; // 转账金额，单位wei
}
