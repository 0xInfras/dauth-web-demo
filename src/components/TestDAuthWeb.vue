<!-- eslint-disable vue/no-parsing-error -->
<template>
  <div>
    <div>
      <label>当前登录状态：</label>
      <label>{{ loginState }}</label>
    </div>
    <div class="TestDAuthWeb1">
      <button @click="startAuth">
        发起Twitter登录授权
      </button>
      <button @click="startAuthGoogle">
        发起Google登录授权
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
      <input type="text" v-model="loginEmailStr" placeholder="请输入邮箱地址">
      <input type="password" v-model="emailPassword" placeholder="密码">
      <button @click="startAuthEmailPassword">
        登录
      </button>
    </div>
    <div class="TestDAuthWeb2">
      <label>address:</label>
      <label ref="addLabel">{{ addressText }}</label>
    </div>
    <div>
      <label>余额:</label>
      <label ref="addLabel">{{ banlanceText }}</label>
    </div>
    <div>
      <label>BUSD余额:</label>
      <label ref="addLabel">{{ usdtText }}</label>
    </div>
    <div class="TestDAuthWeb3">
      <label>转账给</label>
      <input type="text" v-model="transferAddress" placeholder="转出地址">
      <label>0.001eth</label>
      <button @click="transfer">
        提交
      </button>
    </div>
    <div class="TestDAuthWeb4">
      <label>{{ trxRes }}</label>
    </div>
    <div>
      <button @click="queryUserInfo">查询用户信息</button>
      <label>{{ userinfoStr }}</label>
    </div>
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
import { Component, Vue } from 'vue-property-decorator';
import {DAuthWalletManager, TLoginThirdType, TLoginDAuthType} from "dauth-web";


@Component
export default class TestDAuthWeb extends Vue{
  restEmailStr:string = "";
  restEmailVcode:string = "";
  emailNewPwd:string="";

   addressText : string = "地址"
   transferAddress : string = ""
   trxRes : string = "交易结果";

   loginState : string = "未登录";

   emailStr:string = "";
   emailVcode:string = "";

   userinfoStr :string = "";
   banlanceText:string = "";
   usdtText:string= "";

   loginEmailStr:string="";
   bindEmailStr:string= "";
   emailPassword:string="";

   bindEmailVcode:string="";
   setPasswordStr:string="";

   resetOldPassword:string="";
   resetNewPassword:string="";

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
      redirectUri: "http://localhost:3000",
      clientSecret:"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"
    }
    DAuthWalletManager.loginWithType("GOOGLE", data)
  }

  startAuthEmailPassword(){
    const payload = {
        account : this.loginEmailStr,
        external : this.emailPassword
      };
    DAuthWalletManager.loginByMobileOrEmail("EMAILPWD", payload).then((response)=>{
      this.initLoginStata(response);
    }).catch((res)=>{
      window.alert(JSON.stringify(res));
    })
  }

  setPassword(){
    DAuthWalletManager.setPassword({password:this.setPasswordStr})
    .then((ret)=>{
      window.alert(ret.msg);
    }).catch((ret)=>{
      if(ret.error === -1)
      {
        this.loginState = "请重新登录";
      }
      else{
        window.alert(JSON.stringify(ret.data));
      }
    }
    );
  }

  getResetEmailVCode(){
    DAuthWalletManager.sendEmailVerifyCode({email:this.restEmailStr}).then(()=>{
      window.alert("验证码获取成功")
    })
    .catch(
      ()=>{
        window.alert("验证码获取失败")
      }
    );
  }

  restPwdByVcode(){
    DAuthWalletManager.setRecoverPassword("EMAILVCODE",{resetPwd:this.emailNewPwd, payload:{
      account: this.restEmailStr,
      external: this.restEmailVcode
    }})
    .then((ret)=>{
      window.alert(ret.msg);
    }).catch((ret)=>{
        window.alert(JSON.stringify(ret.data));
    }
    );
  }

  restPwdByOldPassword(){

    DAuthWalletManager.setPassword({oldPwd:this.resetOldPassword,
      password:this.resetNewPassword})
    .then((ret)=>{
      window.alert(ret.msg);
    }).catch((ret)=>{
      if(ret.error === -1)
      {
        this.loginState = "请重新登录";
      }
      else{
        window.alert(JSON.stringify(ret.data));
      }
    }
    );

  }

  bindEmail(){
    DAuthWalletManager.bindEmail({email:this.bindEmailStr, verifyCode:this.bindEmailVcode})
    .then((ret)=>{
      window.alert(ret.msg);
    }).catch((ret)=>{
      if(ret.error === -1)
      {
        this.loginState = "请重新登录";
      }
      else{
        window.alert(JSON.stringify(ret.data));
      }
    }
    );
  }

  queryUserInfo(){
    DAuthWalletManager.queryUserInfo().then((ret)=>{
      this.userinfoStr = JSON.stringify(ret.data)
    }).catch((ret)=>{
      if(ret.error === -1)
      {
        this.loginState = "请重新登录";
      }
      else{
        window.alert(JSON.stringify(ret.data))
      }
    })
  }

  getEmailVCode(){
    DAuthWalletManager.sendEmailVerifyCode({email:this.emailStr}).then(()=>{
      window.alert("验证码获取成功")
    })
    .catch(
      ()=>{
        window.alert("验证码获取失败")
      }
    );
  }
  getEmailBindVCode(){
    DAuthWalletManager.sendEmailVerifyCode({email:this.bindEmailStr}).then(()=>{
      window.alert("验证码获取成功")
    })
    .catch(
      ()=>{
        window.alert("验证码获取失败")
      }
    );
  }
  startAuthEmailVerCode(){
    const payload ={
          account : this.emailStr,
          external : this.emailVcode
        };
  
    DAuthWalletManager.loginByMobileOrEmail("EMAILVCODE", payload).then((response)=>{
      console.log("EMAILVCODE login res", response)
      this.initLoginStata(response);
    }).catch((res)=>{
      window.alert(JSON.stringify(res));
    })
}


  logout(){
    DAuthWalletManager.logout().then(()=>{
      this.addressText = "地址";
      window.alert("退出成功");
    }
    ).catch((ret)=>{
      window.alert("退出失败" + JSON.stringify(ret));
    })

  }

   transfer(){
    console.log("transfer", this.addressText)

    const callData = {
          toAddress : this.transferAddress,
          amount:0.001,
          callData:'0x'
        };

    //预估gas
    console.log("trans to ", this.addressText);
    if ("" !== this.addressText){
    DAuthWalletManager.estimateGas(callData).then(
      (gasres)=>{
        console.log("estmit gas ",gasres.data.verificationGas, gasres.data.callGas )
          //gas预估结果，提交交易
        DAuthWalletManager.execute(callData,
            {
              verificationGas:gasres.data.verificationGas,
              callGas:gasres.data.callGas + 21000 * 1000
            }
          ).then((res)=>{
            this.trxRes = res.data;
          }).catch((res)=>{
            window.alert(JSON.stringify( res.data));
          });
        }).catch(
          (res)=>{
            console.log("estimateGas", res);
            window.alert(JSON.stringify( res.data));
          }
        );
      }
  }

  mounted(){
    DAuthWalletManager.initSDK({appId: "1bfe5bbf619681e49cdc62d07badc4cb",
    sdkVersion:"1.2.2",
    serverTag:"test"
  });
    this.checkAuth();
  }

  initLoginStata( response : any ){
    if( response.error === 0){
        this.loginState = response.data + "登录成功";
        // DAuthWalletManager.createWallet().then(
        //   (createRes:any)=>{
        //     console.log(createRes);
        //   this.addressText = createRes.data;
        //   }
        // ).catch((res)=>{
        //   if(res.error === -1){
        //     this.loginState = "请重新登录";
        //   }
        //   else{
        //     window.alert(JSON.stringify(res))
        //   }
        // });

        DAuthWalletManager.queryWalletAddress().then((res)=>{
          console.log("query address ", res.data)
          this.addressText = res.data;
          this.banlanceText = "0"
          DAuthWalletManager.queryWalletBalance().then((ret)=>{
            this.banlanceText = ret.data.toString();
          }).catch((ret)=>{
            if(ret.error === -1){
              this.loginState = "请重新登录";
            }
            else{
              window.alert(JSON.stringify(res.data))
            }
          });
          DAuthWalletManager.queryWalletERC20("0xC95c4D21148FDA28cB86386C48Af62A437ee9fE4").then((ret)=>{
            this.usdtText = ret.data.toString();
          }).catch((ret)=>{
            if(ret.error === -1){
              this.loginState = "请重新登录";
            }
            else{
              window.alert(JSON.stringify(res.data))
            }
          });

        }
        ).catch((res)=>{
          console.log("queryWalletAddress", res);
          if(res.error === -1){
            this.loginState = "请重新登录";
          }
          else{
            if(res.error === 0 ){
              if(res.data === ""){
                    DAuthWalletManager.createWallet().then(
                    (createRes:any)=>{
                      console.log(createRes);
                    this.addressText = createRes.data;
                    }
                  ).catch((res)=>{
                    if(res.error === -1){
                      this.loginState = "请重新登录";
                    }
                    else{
                      window.alert(JSON.stringify(res.data))
                    }
                  });
              }
              else{
                window.alert(JSON.stringify(res))
              }
            }
            else{
              window.alert(JSON.stringify(res))
            }
          }
        });
      }
      else{
        this.loginState = response.data + "登录失败";
      }
    }

   async checkAuth() {
    const response =  await DAuthWalletManager.checkLoginRedirctUrl({url:window.location.href});
    //window.alert(JSON.stringify(response))
    console.log("check data ", response);
    this.initLoginStata(response);
   }
}
</script>

<style lang="less" scoped>

</style>
