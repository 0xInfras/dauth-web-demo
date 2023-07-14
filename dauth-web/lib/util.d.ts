declare const getQueryStringByStr: (name: string, str: string) => string | null;
declare const getQueryString: (name: string) => string;
declare const visitAuthUrl: ({ clientId, redirectUri, authUrl }: {
    clientId: string;
    redirectUri: string;
    authUrl: string;
}) => void;
declare const getAuthMsgByUrl: (callbackUrl: string) => string;
export { getQueryStringByStr, getQueryString, visitAuthUrl, getAuthMsgByUrl };
