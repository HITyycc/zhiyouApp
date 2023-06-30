import { List, Avatar, Text, MD2Colors } from "react-native-paper"
import { StyleSheet } from "react-native"
import { scalefontSize } from "../../../utils/style"

interface userInfoProps {
    nickName: string,
    avatarUrl: string,
    onPress?: () => void
}

export const UserInfo = ({
    nickName,
    avatarUrl,
    onPress
}: userInfoProps) => {
    return <List.Item onPress={onPress} right={() => <Text style={style.rightStyle}>个人资料 {"›"}</Text>} title={nickName} titleStyle={style.titleStyle} left={() => avatarUrl ?  <Avatar.Image source={{
        uri: avatarUrl
    }} />:<Avatar.Text style={{backgroundColor: MD2Colors.green100}} label={nickName.slice(0, 1)} />} />
}

const style = StyleSheet.create({
    titleStyle: {
        fontSize: scalefontSize(1),
        fontWeight: "bold"
    },
    rightStyle: {
        color: MD2Colors.grey600
    }

})