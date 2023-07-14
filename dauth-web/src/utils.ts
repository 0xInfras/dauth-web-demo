// @ts-ignore
import md5 = require('md5');

// 获取url #后面的参数
const getQueryStringByStr = (name: string, str: string) => {
  const queryString = str; // window.location.hash
  if (!queryString) return null; // 如果无参，返回null

  const reg = /[?&]?([^=]+)=([^&]*)/g;
  let tokens;

  while ((tokens = reg.exec(queryString))) {
    if (decodeURIComponent(tokens[1]) === name) {
      return decodeURIComponent(tokens[2]);
    }
  }

  return null;
};

// 获取 url 参数
const getQueryString = (name: string) => {
  let reg: any = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = window.location.search.substr(1).match(reg); // 获取url中"?"符后的字符串并正则匹配
  let context = '';

  if (r != null) context = r[2];
  reg = null;
  r = null;

  return context === null || context === '' || context === 'undefined' ? '' : context;
};

const visitAuthUrl = ({
  clientId,
  redirectUri,
  authUrl,
}: {
  clientId: string;
  redirectUri: string;
  authUrl: string;
}) => {
  window.open(`${authUrl}&redirect_uri=${redirectUri}&client_id=${clientId}`, '_self');
};

const getAuthMsgByUrl = (callbackUrl: string) => {
  let authMsg = '';
  const twitterUrl = new URL(window.location as any);
  if (twitterUrl.searchParams.has('code')) {
    authMsg = getQueryString('code');
  }
  console.log('authMsg', authMsg);
  return authMsg;
};

const getMD5Str = ({ code, user_type }: { code: string; user_type: number }): string => {
  return md5(`code=${code}&security_key=2342a&*&45aeq&user_type=${user_type}`);
};

export { getQueryStringByStr, getQueryString, visitAuthUrl, getAuthMsgByUrl, getMD5Str };
