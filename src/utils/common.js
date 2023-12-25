import axios from 'axios'
import CryptoJS from 'crypto-js';

export const apiList = {
    preCreate : "/v2/order/create",
    getCurrency : "/v2/currency/list" ,
    create : "/v2/order/confirm",
    paid : "/v2/order/paid",
    cancel :"/v2/order/cancel",
    detail :"/v2/order/detail",
    verify :"/v2/order/verify",
    crypto_create: "/crypto/order/create",
    match: "/v2/paymethod/match",
}
export const host = process.env.VUE_APP_HOST_URL
export const cookie = {
    get: function (name) { // 获取
        var arr = document.cookie.match(new RegExp('(^| )' + name + '=([^;]*)(;|$)'));
        if (arr != null) {
            return decodeURI(arr[2]);
        }
        return null;
    },
    set: function (name, value, days) { // 设置
        var Days = days || 30; // 保存天数
        var exp = new Date(); // new Date("December 31, 9998");
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        var expire = 'expires=' + exp.toGMTString();
        //;domain=.nimo.tv
        var cookieValue = name + '=' + encodeURI(value) + ';domain=.infras.tech;path=/;' + expire;
        document.cookie = cookieValue;
    },
    del: function (name) { // 删除
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.get(name);
        if (cval != null) {
            document.cookie = name + '=' + cval + ';domain=.infras.tech;path=/;expires=' + exp.toGMTString();
        
        }
    }
}

export const getScrollTop = function(){
    var scrollTop = 0,bodyScrollTop = 0,documentScrollTop = 0;
   if(document.body){
   bodyScrollTop = document.body.scrollTop;
   }
   if(document.documentElement){
   documentScrollTop = document.documentElement.scrollTop
   }
   scrollTop = (bodyScrollTop -documentScrollTop >0) ? bodyScrollTop :documentScrollTop ;
   return scrollTop 
}



export const goScrollTop = ()=>{
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
}

export const  postEventToken=function(url,formData,sCallback,eCallback,clientId){
    axios
        .post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'client_id': clientId
            }
        })
        .then(response => {
          console.log('Form submitted successfully:', response.data);
          sCallback && sCallback(response)
        })
        .catch(error => {
          console.error('Error submitting form:', error);
          eCallback && eCallback(error);
        });
}

export const localSign=function(formData){
  let params = ''
  let security_key = sessionStorage.getItem('security_key')
  formData.append('security_key', security_key)
  const entries = Array.from(formData.entries());

  // Sort the entries based on key (assuming key is a string)
  entries.sort((a, b) => a[0].localeCompare(b[0]));

  // Create a new FormData instance and append the sorted key-value pairs
  const sortedFormData = new FormData();
  for (const [key, value] of entries) {
    params = params + key + "=" + value
    sortedFormData.append(key, value);
    params += "&"
  }

  let rawString = params.toString()
  rawString = rawString.substr(0, rawString.length - 1);
  const md5Hash = CryptoJS.MD5(rawString);
  sortedFormData.append("sign",md5Hash)
  return sortedFormData;
}

export const is_mobile = navigator.userAgent.toLowerCase().match(/(ipod|ipad|iphone|android|coolpad|mmp|smartphone|midp|wap|xoom|symbian|j2me|blackberry|wince)/i) != null;