import { SafeAreaView, Text, StyleSheet, View } from "react-native"
import { CustomButton } from "../../components/custome/CustomButton"
import { useRouter } from "expo-router"
import React from "react"
import { TextInput } from 'react-native-paper';
import { pTx, scalefontSize } from "../../utils/style";
import { phoneReg, showToast } from "../../utils/utils";
import axios, { AxiosError } from "axios";
import { useLoading } from "../../context/loadingProvider";

const GetSmsCode = () => {
    const router = useRouter()
    const [phoneNumber, setPhoneNumber] = React.useState("")
    const loading = useLoading()

    return <SafeAreaView style={style.wrapper}>
        <View style={style.container}>
            <Text style={style.label} >手机号登录</Text>
            <TextInput autoFocus={true} contentStyle={style.content} style={style.textInputStyle} maxLength={11} activeUnderlineColor="black" value={phoneNumber} keyboardType="numeric" onChangeText={data=>setPhoneNumber(data)} placeholder="请输入手机号码"  />
            <CustomButton disabled={!phoneReg(phoneNumber)} style={style.button} title="获取验证码" backgroundColor="#FFA8BB" width={115}  onPress={async () => {
                try{
                    loading?.showLoading()
                    // 请求发送验证码
                    const req = await axios.post("http://10.249.41.229:3010/auth/getSmsCode", {
                        phoneNumber: phoneNumber
                    })
                    loading?.hideLoading()
                    // 页面跳转
                    router.push({
                        pathname: "(auth)/inputSmsCode",
                        params: {
                            phoneNumber
                        }
                    })
                }catch(err){
                    loading?.hideLoading()
                    if(err instanceof AxiosError){
                        if(err.response?.data.errorCode == 1){
                            showToast("过于频繁获取验证码", "fail")
                        }
                    }
                }
            }} />
            
        </View>
        
    </SafeAreaView>
}

const style = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    container: {
        paddingTop: pTx(86),
        paddingLeft: pTx(37),
        paddingRight: pTx(37),
        flex: 1,
        rowGap: pTx(20)
    },
    label: {
        fontSize: scalefontSize(20/14)
    },
    button: {
        marginTop: pTx(20),
        alignSelf: "center"
    },
    textInputStyle: {
        backgroundColor: '#FFFFFF00'
    },
    content: {
        paddingLeft: 0
    }
})

export default GetSmsCode