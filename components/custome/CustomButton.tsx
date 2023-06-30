import { Pressable, StyleSheet, View, Text, ViewStyle} from "react-native"
import { pTx, scalefontSize } from "../../utils/style"
import React from "react"



interface CustomButtonProps{
    width: number,
    color?: string,
    title: string,
    backgroundColor?: string,
    onPress?: () => void,
    style?: ViewStyle,
    disabled?: boolean
}

export const CustomButton = (props: CustomButtonProps) => {
    const style = React.useMemo(() => {
        const style = StyleSheet.create({
            button: {
                height: scalefontSize(3),
                justifyContent: "center",
                width: pTx(props.width),
                backgroundColor: props.backgroundColor ?? "white",
                borderRadius: 50
            },
            text: {
                textAlign: "center",
                color: props.disabled? "#fafafa":(props.color ?? 'black'),
            },
            disabled: {
                color: "#dddddd",
                backgroundColor: "#dbdbdb"
            }
        })
        return style
    }, [props.color, props.backgroundColor, props.width]) 
    return <Pressable disabled={props.disabled ?? false} style={[style.button, props.style, props.disabled? style.disabled:undefined]} onPress={props.onPress}>
        <Text style={style.text}>
            {props.title}
        </Text>
    </Pressable>
}

