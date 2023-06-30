import { StyleSheet } from 'react-native';

import { Text, View, Image } from 'react-native';;
import { styleUtils } from '../../../utils';
import { CustomButton } from '../../../components/custome/CustomButton';
import { useAuthAxios } from "../../../context/authAxiosProvider"
import { useEffect } from 'react';
import React from 'react';
import { useRouter } from 'expo-router';

export default function ChatWelcome() {
  const [chatId, setChatId] = React.useState("")
  const authAxios = useAuthAxios()
  const route = useRouter()

  useEffect(() => {
    (async () => {
      const res = await authAxios?.authAxios.get("http://10.249.41.229:3010/chat/getConversationList")
      if(res?.data.data.conversationList.length == 0){
        // 为用户创建一个会话
        const res = await authAxios?.authAxios.get("http://10.249.41.229:3010/chat/createnewconveration")
        setChatId(res?.data.data.newId)
      }else{
        setChatId(res?.data.data.conversationList[0].conversation_id)
      }
    })()
  }, [])

  return (
    <View style={styles.container}>
      <Image style={styles.robot} source={require("../../../assets/images/chat/robot.png")} />
      <CustomButton title='点击与他聊天' width={141} color='white' onPress={() => {
        if(chatId){
          route.push(`/chat/${chatId}`)
        }
      }} backgroundColor='#73B5FF' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingTop: styleUtils.pTx(38),
    rowGap: styleUtils.pTx(30)
  },
  robot: {
    width: styleUtils.pTx(132),
    height: styleUtils.pTx(132)
  }
});
