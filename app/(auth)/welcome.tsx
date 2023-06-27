import { Text, StyleSheet, Image, View, Button, Pressable } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { styleUtils } from "../../utils"
import { CustomButton } from "../../components/custome/CustomButton"
import { useRouter } from "expo-router"


const WelcomePage = () => {
    const rounter = useRouter()
    return <SafeAreaView style={style.container}>
        <View style={style.containerView}>
            <Image style={style.welcome} source={require("../../assets/images/auth/welcome.png")} />
            <Image style={style.robot} resizeMode="contain" source={require("../../assets/images/auth/robotSayHi.png")} />
            <CustomButton width={155} title="手机号登录" onPress={() => rounter.push("getSmsCode")} />
        </View>
    </SafeAreaView>
}

const style = StyleSheet.create({
    container: {
        backgroundColor: "#FFD579",
        flex: 1
    },
    containerView: {
        paddingTop: styleUtils.pTx(90),
        flex: 1,
        alignItems: "center"
    },
    welcome: {
        width: styleUtils.pTx(198),
        height: styleUtils.pTx(34),
    },
    robot: {
        width: styleUtils.pTx(152),
        height: styleUtils.pTx(139),
        position: "relative",
        right: "5%",
        marginTop: styleUtils.pTx(10),
        marginBottom: styleUtils.pTx(40)
    }
})


export default WelcomePage