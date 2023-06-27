import { StyleSheet } from "react-native"
import { TextInput, MD2Colors } from "react-native-paper"
import { scalefontSize } from "../../utils/style"
import { TextInput as RNTextInput } from 'react-native';
import React from "react"

interface DigitInputBoxProps {
    autoFocus?: boolean,
    activeOutlineColor?: string
    refValue?: React.RefObject<RNTextInput>,
    value?: string,
    onChangeText?: (data: string)=>void,
    onKeyPress?: (data: {nativeEvent: {key: string} }) => void
}

export const DigitInputBox = ({
    autoFocus=false,
    activeOutlineColor,
    refValue,
    value,
    ...props
}: DigitInputBoxProps) => {
    return <TextInput {...props} accessible={value!=""} ref={refValue} autoFocus={autoFocus} maxLength={1} style={style.container} outlineColor={MD2Colors.grey300} contentStyle={style.textCenter} mode="outlined" activeOutlineColor={activeOutlineColor} keyboardType="numeric"/>

}

const style = StyleSheet.create({
    container: {
        // borderColor: MD2Colors.grey400
        width: scalefontSize(4),
        height: scalefontSize(4),
        fontSize: scalefontSize(2)
    },
    textCenter:{
        textAlign: "center"
    }
})