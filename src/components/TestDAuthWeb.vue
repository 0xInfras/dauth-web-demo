<template>
  <div>
    <div>
      <label>当前链</label>
      <select v-model="selectedOption">
        <option v-for="option in options" :value="option.text" :key="option.value">
          {{ option.text }}
        </option>
      </select>
    </div>
    <div>
      <label>当前登录状态：</label>
      <label>{{ loginState }}</label>
    </div>
    <br />

    <div>
      <button @click="startAuth">
        发起Twitter登录授权
      </button>
      <button @click="startAuthGoogle">
        发起Google登录授权
      </button>
      <button @click="startTgLogin">
        发起Telegram登录授权
      </button>
    </div>

    <div>
      <input type="text" v-model="emailStr" placeholder="请输入邮箱地址">
      <button @click="getEmailVCode">
        获取验证码
      </button>
      <input type="text" v-model="emailVcode" placeholder="验证码">
      <button @click="startAuthEmailVerCode">
        登录
      </button>
    </div>

    <div>
      <input type="text" v-model="phoneAreaCode" />
      <input type="text" v-model="phoneStr" placeholder="请输入手机号">
      <button @click="getPhoneVCode">
        获取验证码
      </button>
      <input type="text" v-model="phoneCode" placeholder="验证码">
      <button @click="startAuthPhoneVerCode">
        登录
      </button>
    </div>
    <div>
      <input type="text" v-model="loginEmailStr" placeholder="请输入邮箱地址">
      <input type="password" v-model="emailPassword" placeholder="密码">
      <button @click="startAuthEmailPassword">
        登录
      </button>
    </div>
    <br />

    <div>
      <label>address:</label>
      <label>{{ addressText }}</label>
    </div>
    <div>
      <label>余额:</label>
      <label>{{ banlanceText }}</label>
    </div>
    <div>
      <label>转账给</label>
      <input type="text" v-model="transferAddress" placeholder="转出地址">
      <label>0.001eth</label>
      <button @click="transfer">
        提交
      </button>
    </div>
    <br />

    <div>
      <select v-model="tokenCode">
        <option v-for="option in tokenCodes" :value="option.text" :key="option.value">
          {{ option.text }}
        </option>
      </select>
      <select v-model="faitCode">
        <option v-for="option in faitCodes" :value="option.text" :key="option.value">
          {{ option.text }}
        </option>
      </select>
      <input type="text" v-model="failAmount" placeholder="法币数量">
      <button @click="buyToken">购买token</button>
      <div>
        <label>查询ERC20余额:</label>
      </div>
      <div>
        <label>ERC20地址:</label>
        <input type="text" v-model="erc20Address" placeholder="ERC20地址">
        <button @click="qureyErcBlance">
          查询
        </button>
        <label>{{ erc20Text }}</label>
      </div>
      <label>转账给</label>
      <input type="text" v-model="transferAddressBUSD" placeholder="转出地址">
      <label>{{ toErc20Value }}</label>
      <button @click="transferBusd">
        提交
      </button>
    </div>
    <br />

    <div>
      <label>{{ trxRes }}</label>
    </div>

    <div>
      <button @click="queryUserInfo">查询用户信息</button>
      <label>{{ userinfoStr }}</label>

    </div>
    <br />

    <div>
      <label>绑定邮箱:</label>
      <input type="text" v-model="bindEmailStr" placeholder="请输入邮箱地址">
      <button @click="getEmailBindVCode">
        获取验证码
      </button>
      <input type="text" v-model="bindEmailVcode" placeholder="验证码">
      <button @click="bindEmail">
        绑定
      </button>
    </div>
    <div>
      <input type="text" v-model="setPasswordStr" placeholder="设置密码">
      <button @click="setPassword">设置</button>
    </div>
    <div>
      <label>邮箱验证修改密码:</label>
      <input type="text" v-model="restEmailStr" placeholder="请输入邮箱地址">
      <button @click="getResetEmailVCode">
        获取验证码
      </button>
      <input type="text" v-model="restEmailVcode" placeholder="验证码">
      <input type="text" v-model="emailNewPwd" placeholder="新密码">
      <button @click="restPwdByVcode">
        修改
      </button>
    </div>
    <div>
      <label>原始密码修改密码:</label>
      <input type="text" v-model="resetOldPassword" placeholder="旧密码">
      <input type="text" v-model="resetNewPassword" placeholder="新密码">
      <button @click="restPwdByOldPassword">
        修改
      </button>
    </div>
    <div>
      <button @click="logout">退出</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
import {
  CommonResponse, DAuthWalletManager, IExcuteData, ethers,
  QueryUserInfoResult, KycStatus, Currency
} from "dauth-web";
import erc20 from "./ERC20.json";

export interface Op {
  value: string,
  text: string,
  data:string
}


export default class TestDAuthWeb extends Vue {
  selectedOption = ""

  options: Op[] = [];

  tokenCode=''
  tokenCodes:Op[] =[]
  faitCode="USD"
  faitCodes:Op[]=[]
  failAmount=10


  restEmailStr = ""
  restEmailVcode = ""
  emailNewPwd = ""

  addressText = "地址"
  transferAddress = ""
  trxRes = ""

  loginState = "未登录"

  emailStr = ""
  emailVcode = ""

  userinfoStr = ""
  banlanceText = ""

  erc20Address = ""
  erc20Text = "余额"
  erc20Resiver = ""

  loginEmailStr = ""
  bindEmailStr = ""

  emailPassword = ""

  bindEmailVcode = ""
  setPasswordStr = ""

  resetOldPassword = ""
  resetNewPassword = ""

  transferAddressBUSD = ""

  phoneStr = ""
  phoneCode = ""
  phoneAreaCode = "86"

  toErc20Value = ""

  startAuth() {
    const info = {
      clientId: 'Vks1X3E3WVZoTHpXUUx3RGhaNlU6MTpjaQ',
      redirectUri: "https://demos.infras.online/space"
    }
    DAuthWalletManager.loginWithType("TWITTER", info)
  }

  startAuthGoogle() {
    const data = {
      clientId: '209392989758-j14das5beql07e9ifomltgv3icgiuuvh.apps.googleusercontent.com',
      redirectUri: "https://localhost:3000",
      clientSecret: "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"
    }
    DAuthWalletManager.loginWithType("GOOGLE", data)
  }
  startTgLogin() {
    DAuthWalletManager.loginWithType("TELEGRAM", { redirectUri: "https://localhost:3000" })
  }
  startAuthEmailPassword() {
    const payload = {
      account: this.loginEmailStr,
      external: this.emailPassword
    };
    DAuthWalletManager.loginByMobileOrEmail("EMAILPWD", payload).then((response) => {
      this.initLoginStata(response);
    }).catch((res) => {
      window.alert(JSON.stringify(res));
    })
  }

  setPassword() {
    DAuthWalletManager.setPassword({ password: this.setPasswordStr })
      .then((ret) => {
        window.alert(ret.msg);
      }).catch((ret) => {
        if (ret.error === -1) {
          this.loginState = "请重新登录";
        }
        else {
          window.alert(JSON.stringify(ret.data));
        }
      }
      );
  }

  getResetEmailVCode() {
    DAuthWalletManager.sendEmailVerifyCode({ email: this.restEmailStr }).then(() => {
      window.alert("验证码获取成功")
    })
      .catch(
        () => {
          window.alert("验证码获取失败")
        }
      );
  }

  restPwdByVcode() {
    DAuthWalletManager.setRecoverPassword("EMAILVCODE", {
      resetPwd: this.emailNewPwd, payload: {
        account: this.restEmailStr,
        external: this.restEmailVcode
      }
    })
      .then((ret) => {
        window.alert(ret.msg);
      }).catch((ret) => {
        window.alert(JSON.stringify(ret.data));
      }
      );
  }

  restPwdByOldPassword() {

    DAuthWalletManager.setPassword({
      oldPwd: this.resetOldPassword,
      password: this.resetNewPassword
    })
      .then((ret) => {
        window.alert(ret.msg);
      }).catch((ret) => {
        if (ret.error === -1) {
          this.loginState = "请重新登录";
        }
        else {
          window.alert(JSON.stringify(ret.data));
        }
      }
      );

  }

  bindEmail() {
    DAuthWalletManager.bindEmail({ email: this.bindEmailStr, verifyCode: this.bindEmailVcode })
      .then((ret) => {
        window.alert(ret.msg);
      }).catch((ret) => {
        if (ret.error === -1) {
          this.loginState = "请重新登录";
        }
        else {
          window.alert(JSON.stringify(ret.data));
        }
      }
      );
  }

  queryUserInfo() {
    DAuthWalletManager.queryUserInfo().then((ret) => {
      this.userinfoStr = JSON.stringify(ret.data)
    }).catch((ret) => {
      if (ret.error === -1) {
        this.loginState = "请重新登录";
      }
      else {
        window.alert(JSON.stringify(ret.data))
      }
    })
  }


  getEmailVCode() {
    DAuthWalletManager.sendEmailVerifyCode({ email: this.emailStr }).then(() => {
      window.alert("验证码获取成功")
    })
      .catch(
        () => {
          window.alert("验证码获取失败")
        }
      );
  }

  getPhoneVCode() {
    DAuthWalletManager.sendPhoneVerifyCode({
      phone: this.phoneStr,
      areaCode: this.phoneAreaCode
    }).then(() => {
      window.alert("验证码获取成功")
    })
      .catch(
        () => {
          window.alert("验证码获取失败")
        }
      );
  }
  getEmailBindVCode() {
    DAuthWalletManager.sendEmailVerifyCode({ email: this.bindEmailStr }).then(() => {
      window.alert("验证码获取成功")
    })
      .catch(
        () => {
          window.alert("验证码获取失败")
        }
      );
  }
  startAuthEmailVerCode() {
    const payload = {
      account: this.emailStr,
      external: this.emailVcode
    };

    DAuthWalletManager.loginByMobileOrEmail("EMAILVCODE", payload).then((response) => {
      console.log("EMAILVCODE login res", response)
      this.initLoginStata(response);
    }).catch((res) => {
      window.alert(JSON.stringify(res));
    })
  }

  startAuthPhoneVerCode() {
    const payload = {
      account: this.phoneStr,
      external: this.phoneCode,
      areaCode: this.phoneAreaCode
    };

    DAuthWalletManager.loginByMobileOrEmail("PHONEVCODE", payload).then((response) => {
      console.log("PHONEVCODE login res", response)
      this.initLoginStata(response);
    }).catch((res) => {
      window.alert(JSON.stringify(res));
    })
  }


  logout() {
    DAuthWalletManager.logout().then(() => {
      this.addressText = "地址";
      window.alert("退出成功");
    }
    ).catch((ret) => {
      window.alert("退出失败" + JSON.stringify(ret));
    })

  }

  doCallTest(callData: IExcuteData) {
    //预估gas
    console.log("trans to ", this.addressText);
    if ("" !== this.addressText) {
      DAuthWalletManager.estimateGas(callData).then(
        (gasres) => {
          console.log("estmit gas ", gasres.data.verificationGas, gasres.data.callGas)
          //gas预估结果，提交交易
          DAuthWalletManager.execute(callData,
            gasres.data
          ).then((res) => {
            this.trxRes = res.data;
          }).catch((res) => {
            window.alert(JSON.stringify(res.data));
          });
        }).catch(
          (res) => {
            console.log("estimateGas", res);
            window.alert(JSON.stringify(res.data));
          }
        );
    }
  }

  transfer() {
    console.log("transfer", this.addressText)
    //this.doCallTest(0.001, "0x");
    const callData = {
      toAddress: this.transferAddress,
      amount: 0.001,
      callData: '0x'
    };

    this.doCallTest(callData);
  }

  transferBusd() {
    console.log("transfer ");
    //自己链接钱包，查询小数位
    // const privoder = new ethers.providers.JsonRpcProvider("")


    const token = new ethers.utils.Interface(erc20.abi);
    const callData = {
      toAddress: this.erc20Address,
      amount: 0,
      callData: token.encodeFunctionData("transfer",
        [ethers.utils.getAddress(this.transferAddressBUSD), this.toErc20Value]),
    }
    this.doCallTest(callData);
  }

  mounted() {
    const list = DAuthWalletManager.getChainList()
    for (const l of list) {
      this.options.push({ value: l, text: l , data:""})

    }
    this.selectedOption = this.options[0].value;

    //查询可购买币种
    DAuthWalletManager.queryCryptoTypes().then(( cryptos : CommonResponse< Currency>)=>{
      this.tokenCodes = []
      for(const c of cryptos.data.crypto)
      {
        this.tokenCodes.push({text: c.cryptoCode, value:c.cryptoCode, data:c.cryptoIcon})
      }
      if(this.tokenCodes.length > 0)
      {
        this.tokenCode = this.tokenCodes[0].value
      }
      this.faitCodes = []
      for(const c of cryptos.data.faitCodes)
      {
        this.faitCodes.push({text: c, value:c, data:""})
      }
      if(this.faitCodes.length > 0)
      {
        this.faitCode = this.faitCodes[0].value
      }
      
    }
    ).catch(()=>{
      window.alert("查询可购买币种列表失败")
    })
    this.checkAuth();
  }

  async initLoginStata(response: CommonResponse<string>) {
    if (response.error === 0) {
      this.loginState = response.data + "登录成功";
      // await DAuthWalletManager.createWallet().then(
      //   (createRes:any)=>{
      //     console.log(createRes);
      //   this.addressText = createRes.data;
      //   }
      // ).catch((res)=>{
      //   if(res.error === -1){
      //     this.loginState = "请重新登录";
      //   }
      //   else{
      //     console.log("createWallet error",res)
      //     window.alert(JSON.stringify(res))
      //   }
      // });

      DAuthWalletManager.queryWalletAddress().then((res) => {
        console.log("query address ", res.data)
        this.addressText = res.data;
        this.banlanceText = "0"
        DAuthWalletManager.queryWalletBalance().then((ret) => {
          this.banlanceText = ret.data.toString();
        }).catch((ret) => {
          if (ret.error === -1) {
            this.loginState = "请重新登录";
          }
          else {
            window.alert(JSON.stringify(res.data))
          }
        });
      }
      ).catch((res) => {
        console.log("queryWalletAddress", res);
        if (res.error === -1) {
          this.loginState = "请重新登录";
        }
        else {
          if (res.error === 0) {
            if (res.data === "") {
              DAuthWalletManager.createWallet().then(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (createRes: any) => {
                  console.log(createRes);
                  this.addressText = createRes.data;
                }
              ).catch((res) => {
                if (res.error === -1) {
                  this.loginState = "请重新登录";
                }
                else {
                  window.alert(JSON.stringify(res.data))
                }
              });
            }
            else {
              window.alert(JSON.stringify(res))
            }
          }
          else {
            window.alert(JSON.stringify(res))
          }
        }
      });
    }
    else {
      this.loginState = response.data + "登录失败";
    }
  }

  qureyErcBlance() {
    DAuthWalletManager.queryWalletERC20(this.erc20Address).then((ret) => {
      this.erc20Text = ret.data.toString();
    }).catch((ret) => {
      if (ret.error === -1) {
        this.loginState = "请重新登录";
      }
      else {
        window.alert(JSON.stringify(ret.data))
      }
    });
  }

  async checkAuth() {
    try {
      const response = await DAuthWalletManager.checkLoginRedirctUrl({ url: window.location.href });
      //window.alert(JSON.stringify(response))
      console.log("check data ", response);
      this.initLoginStata(response);
    }
    catch (err) {
      console.log(err)
    }
  }

  buyToken() {
    DAuthWalletManager.isKYC().then((res: CommonResponse<KycStatus>) => {
      DAuthWalletManager.queryUserInfo().then(( info: CommonResponse<QueryUserInfoResult | object>) => {
        const infoConvert = info.data as QueryUserInfoResult
        const kycState = res.data
        if (kycState === "NeedBindEmail") {
          window.alert("请先绑定email")
        }
        else if (kycState === "NeedKYC" || kycState === "KYCFailed") {
          this.$router.push({
            name: 'KycPage',
            query: {email: infoConvert.email}
          })
          // let icon = ""
          // for(const c of this.tokenCodes){
          //   if(c.value === this.tokenCode)
          //   {
          //     icon = c.data
          //   }
          // }
          // this.$router.push({
          //   name: 'CheckOut',
          //   query: {faitCode:this.faitCode, amount:this.failAmount, cryptoCode:this.tokenCode, cryptoIcon:icon}
          // })
        }
        else if (kycState === "KYCSucess") {
          let icon = ""
          for(const c of this.tokenCodes){
            if(c.value === this.tokenCode)
            {
              icon = c.data
            }
          }
          this.$router.push({
            name: 'CheckOut',
            query: {faitCode:this.faitCode, amount:this.failAmount, cryptoCode:this.tokenCode, cryptoIcon:icon}
          })
        }
        else {
          window.alert("正在审核kyc资料")
        }

      }).catch(() => {
        window.alert(JSON.stringify(res))
      })

    }
    ).catch((res) => {
      window.alert(JSON.stringify(res))
    })
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
