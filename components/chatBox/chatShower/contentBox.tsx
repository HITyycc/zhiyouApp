import { Text, StyleSheet, View } from "react-native";
import { pTx, scalefontSize } from "../../../utils/style";


interface ContentBoxType {
    content: string
    showLoadingDot?: boolean
    left: boolean
}

const ContentBox = ({
    content = "",
    showLoadingDot = false,
    left
}: ContentBoxType) => {
    return <View style={[style.contentBox, left ? style.left:{}]}>
            <Text style={style.text} selectable={true}>{content}{showLoadingDot ? "●":""}</Text>
        </View>
}


const style = StyleSheet.create({
    contentBox: {
        maxWidth: pTx(176),
        backgroundColor: "#FFD7F2",
        padding: pTx(8),
        borderRadius: 10,
        alignSelf: "flex-end"
    },
    text: {
        fontSize: scalefontSize(1.2),
        lineHeight: scalefontSize(1.6)
    },
    left: {
        backgroundColor: "#B7D9FF",
        alignSelf: "flex-start"
    }
})
export default ContentBox