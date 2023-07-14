declare const getQueryStringByStr: (name: string, str: string) => string | null;
declare const getQueryString: (name: string) => string;
declare const visitAuthUrl: ({ clientId, redirectUri, authUrl, }: {
    clientId: string;
    redirectUri: string;
    authUrl: string;
}) => void;
declare const getAuthMsgByUrl: (callbackUrl: string) => string;
declare const getMD5Str: ({ code, user_type }: {
    code: string;
    user_type: number;
}) => string;
export { getQueryStringByStr, getQueryString, visitAuthUrl, getAuthMsgByUrl, getMD5Str };
