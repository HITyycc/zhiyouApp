import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import { DigitInputBox } from "../../components/custome/DigitInputBox";
import { pTx, scalefontSize } from "../../utils/style";
import { TextInput as RNTextInput, Pressable, Keyboard } from "react-native";
import { CustomButton } from "../../components/custome/CustomButton";
import React from "react";
import { MD2Colors } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios, { AxiosError } from "axios";
import { useLoading } from "../../context/loadingProvider";
import { showToast } from "../../utils/utils";
import Toast from "react-native-root-toast";
import { storage } from "../../utils/store";
import { utils } from "../../utils";
import { useAuth } from "../../context/auth";


const InputSmsCode = () => {
  const firstDigitRef = React.useRef<RNTextInput>(null);
  const secondDigitRef = React.useRef<RNTextInput>(null);
  const thirdDigitRef = React.useRef<RNTextInput>(null);
  const forthDigitRef = React.useRef<RNTextInput>(null);
  const startTime = React.useRef<Date|null>(null)
  const [resendCount, setResendCount] = React.useState(0)
  const [timer, setTimer] = React.useState(60);
  const refArr = [firstDigitRef, secondDigitRef, thirdDigitRef, forthDigitRef];
  const params = useLocalSearchParams()
  const loading = useLoading()
  const auth = useAuth()
  const router = useRouter()

  const [code, setCode] = React.useState(["", "", "", ""]);
  const onChangeText = (idx: number) => {
    return (data: string) => {
      if (data && idx != 3) {
        refArr[idx + 1].current?.focus();
      }
      setCode((pre) => {
        const copy = [...pre];
        copy[idx] = data;
        return copy;
      });
    };
  };

  React.useEffect(( )=> {
    (async() => {
      if(code.every((num) => num != "")){
        try{
          const res = await axios.post("http://10.249.41.229:3010/auth/verifySmsCode", {
          phoneNumber: params.phoneNumber,
          code: code.join("")
          })
          await storage.set("jwt-token", res.headers['authorization'] ?? res.headers.toJSON)
          console.log(res)
          const jwtToken = res.headers['authorization'].split(".")[1]
          const jwtObj = JSON.parse(utils.base64ToUtf8(jwtToken))
          const userData: jwtUserInfo = {
            userId: jwtObj.userId,
            avatarUrl: jwtObj.nickname,
            nickname: jwtObj.nickname
          }
          auth?.signIn(userData)
          showToast("登录成功", "success")
          router.replace("(tabs)")
        }catch(err){
          console.log(err)
          if(err instanceof AxiosError){
            if(err.response?.data.errorCode == 1){
              showToast("验证码已过期", "fail")
            }else if(err.response?.data.errorCode == 2){
              showToast("验证码输入错误", "fail")
            }
          }
        }
        
      }
    })()
    
  }, [code.every((num) => num != "")])


  const onKeyPress = (idx: number) => {
    return (data: { nativeEvent: { key: string } }) => {
      if (idx != 0 && data.nativeEvent.key === "Backspace" && code[idx] == "") {
        refArr[idx - 1].current?.focus();
        setCode((pre) => {
          const copy = [...pre];
          copy[idx - 1] = "";
          return copy;
        });
      }
    };
  };

  React.useEffect(() => {
    startTime.current = new Date()
    const intervalId = setInterval(() => {
      setTimer((pre) => {
        if(startTime.current instanceof Date){
          const diff = Math.floor((new Date().getTime() - startTime.current.getTime())/1000)
          if(diff >= 60){
            clearInterval(intervalId);
            return 0
          }else{
            return 60-diff
          }
        }

        if (pre == 1) {
          clearInterval(intervalId);
        } 
        return pre - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [resendCount]);

  const resendSmsCode = async () => {
    try{
      loading?.showLoading()
      const req = await axios.post("http://10.249.41.229:3010/auth/getSmsCode", {
          phoneNumber: params.phoneNumber
      })
      loading?.hideLoading()
      showToast("获取验证码成功", "success")
      setCode(["", "", "", ""])
      firstDigitRef.current?.focus()
      setTimer(60)
      setResendCount(pre => pre+1)
    }catch(err){
        loading?.hideLoading()
        showToast("获取验证码失败", "fail")
    }
  }

  return (
    <SafeAreaView>
      <View style={style.wrapper}>
        <Text style={style.lable}>输入验证码</Text>
        <Text style={style.lablePhone}>验证码已发送至+86 {params.phoneNumber}</Text>
        <View style={style.digitContainer}>
          {refArr.map((val, idx) => {
            return (
              <DigitInputBox
                key = {idx}
                onKeyPress={onKeyPress(idx)}
                value={code[idx]}
                onChangeText={onChangeText(idx)}
                autoFocus={idx === 0}
                refValue={val}
                activeOutlineColor={MD2Colors.grey500}
              />
            );
          })}
        </View>
        {timer > 0 ? (
          <Text style={style.reSendTimer}>{timer + ""}s后可重新获取</Text>
        ) : (
          <Pressable onPress={resendSmsCode}><Text style={style.reSendButton}>重新获取验证码</Text></Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  wrapper: {
    paddingTop: pTx(70),
    paddingLeft: pTx(15),
    paddingRight: pTx(15),
  },
  digitContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: scalefontSize(0.5),
    paddingBottom: scalefontSize(1),
    paddingTop: scalefontSize(1.5),
  },
  button: {
    alignSelf: "center",
  },
  lable: {
    fontSize: scalefontSize(1.5),
    fontWeight: "bold",
  },
  lablePhone: {
    fontSize: scalefontSize(0.8),
    lineHeight: scalefontSize(1.2),
    color: MD2Colors.grey500,
  },
  reSendTimer: {
    fontSize: scalefontSize(0.8),
    marginBottom: scalefontSize(3),
  },
  reSendButton:{
    color: MD2Colors.blue900
  }
});

export default InputSmsCode;
