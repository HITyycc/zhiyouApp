import { List, Avatar, Text, MD2Colors } from "react-native-paper"
import { StyleSheet } from "react-native"
import { scalefontSize } from "../../../utils/style"

interface userInfoProps {
    nickName: string,
    avatarUrl: string
}

export const UserInfo = ({
    nickName,
    avatarUrl
}: userInfoProps) => {
    return <List.Item right={() => <Text style={style.rightStyle}>个人资料 {">"}</Text>} title={nickName} titleStyle={style.titleStyle} left={() => avatarUrl === "" ? <Avatar.Text style={{backgroundColor: MD2Colors.green100}} label={nickName.slice(0, 1)} />: <Avatar.Image source={{
        uri: avatarUrl
    }} />} />
}

const style = StyleSheet.create({
    titleStyle: {
        fontSize: scalefontSize(1),
        fontWeight: "bold"
    },
    rightStyle: {

    }

})