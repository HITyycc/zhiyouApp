import { Text, View, SafeAreaView, StyleSheet } from "react-native"
import { fillStyle, scalefontSize } from "../../utils/style"
import { CustomButton } from "../../components/custome/CustomButton"
import { useAuth } from "../../context/auth"

const UserInfo = () => {
    const auth = useAuth()
    return <SafeAreaView style={fillStyle}>
        <View style={[fillStyle, style.container]}>
            <CustomButton onPress={() => {auth?.signOut()}} width={221}  title="退出登录" color="white" backgroundColor="#FFA8BB" style={style.btn}/>
        </View>
    </SafeAreaView>
}


const style = StyleSheet.create({
    container:{
        backgroundColor: "white",
        alignItems: "center"
    },
    btn: {
        position: "absolute",
        bottom: scalefontSize(3)
    }
})

export default UserInfo