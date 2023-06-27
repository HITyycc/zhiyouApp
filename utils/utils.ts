import { Buffer } from "buffer"
import Toast from 'react-native-root-toast';
import { pTx, scalefontSize } from "./style";
import { StyleSheet } from "react-native"


export const base64ToUtf8 = (base64Str: string) => {
    return Buffer.from(base64Str, "base64").toString("utf-8")
}

export const phoneReg = (phoneNumber: string) => {
    const regex = /^1[345678]\d{9}$/
    return regex.test(phoneNumber)
    
}

export const showToast = (message: string, type: "fail" | "success" = "success") => {
    let toast:Toast
    if(type == "fail"){
        toast = Toast.show(message, {
            duration: Toast.durations.LONG,
            position: Toast.positions.CENTER,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
        })
    }else{
        toast = Toast.show("✔ " +message, {
            duration: Toast.durations.LONG,
            position: pTx(70),
            shadow: false,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: "white",
            textStyle: {
                color: "black",
                fontSize: scalefontSize(0.8)
            },
            containerStyle: {
                paddingHorizontal: scalefontSize(2)
            }
        })
    }

    setTimeout(() => {
        Toast.hide(toast)
    }, 1500)

}
