declare class Http {
    /**
     * @description get请求
     * @param {*} url
     * @param {*} options
     */
    static get(url: URL | RequestInfo, options?: any): Promise<any>;
    /**
     * @description post请求
     * @param {*} url
     * @param {*} [data={}]
     * @param {*} options
     * @return {*}
     */
    static post(url: URL | RequestInfo, data?: any, options?: any): Promise<any>;
    /**
     * @description put请求
     * @static
     * @param {*} url
     * @param {*} [data={}]
     * @param {*} options
     * @return {*}
     */
    static put(url: URL | RequestInfo, data?: {}, options?: any): Promise<any>;
}
export { Http };
