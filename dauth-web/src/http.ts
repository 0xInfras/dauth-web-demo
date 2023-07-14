const mergeOptions = (defaultOptions: any = {}, options: any = {}) => {
  const headers = Object.assign({}, defaultOptions.headers, options.headers);
  return Object.assign({}, defaultOptions, options, { headers });
};

class Http {
  /**
   * @description get请求
   * @param {*} url
   * @param {*} options
   */
  static async get(url: URL | RequestInfo, options?: any) {
    // 定义默认请求头参数
    const defaultOptions = {
      headers: {
        // Token: 'Authtion',
      },
      mode: 'cors',
      credentials: 'omit',
    };
    // 如果需要额外拼接请求头信息,根据条件进行添加
    // if (true) {
    //   Object.assign(defaultOptions.headers, {
    //     'AUTH-TOkKEN': 'AUTH-TOkKEN',
    //   });
    // }
    const response = await fetch(url, mergeOptions(defaultOptions, options));
    return response.json();
  }
  /**
   * @description post请求
   * @param {*} url
   * @param {*} [data={}]
   * @param {*} options
   * @return {*}
   */
  static async post(url: URL | RequestInfo, data: any = {}, options?: any) {
    const formData = new FormData();
    for (const name in data as any) {
      if (data.name) {
        formData.append(name, data[name]);
      }
    }

    const defaultOptions = {
      headers: {
        // 'Content-Type': 'multipart/form-data',
      },
      method: 'post',
      body: formData,
      mode: 'cors',
      credentials: 'omit',
    };
    // 如果需要额外拼接请求头信息,根据条件进行添加
    // if (true) {
    //   Object.assign(defaultOptions.headers, {
    //     'AUTH-TOkKEN': 'AUTH-TOkKEN',
    //   });
    // }
    const response = await fetch(url, mergeOptions(defaultOptions, options));
    return response.json();
  }
  /**
   * @description put请求
   * @static
   * @param {*} url
   * @param {*} [data={}]
   * @param {*} options
   * @return {*}
   */
  static async put(url: URL | RequestInfo, data = {}, options?: any) {
    const defaultOptions = {
      headers: {
        // 'Content-Type': 'multipart/form-data;',
      },
      method: 'put',
      body: JSON.stringify(data),
      mode: 'cors',
      credentials: 'omit',
    };
    // 如果需要额外拼接请求头信息,根据条件进行添加
    // if (true) {
    //   Object.assign(defaultOptions.headers, {
    //     'AUTH-TOkKEN': 'AUTH-TOkKEN',
    //   });
    // }
    const response = await fetch(url, mergeOptions(defaultOptions, options));
    return response.json();
  }
}

export { Http };
