import { ActivityIndicator, Portal, MD2Colors } from "react-native-paper"
import { StyleSheet, View } from "react-native"

const Loading = () => {
    return <Portal>
        <View style={style.container}>
          <ActivityIndicator size="large" animating={true} color={MD2Colors.blue500} />
        </View>
    </Portal>
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center"
    }
})

export default Loading