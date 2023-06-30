import { StyleSheet, View } from 'react-native';

import { UserInfo } from '../../../components/custome/me/UserInfo';
import { useAuth } from '../../../context/auth';
import { fillStyle, pTx, scalefontSize } from '../../../utils/style';
import { List, Avatar, MD2Colors } from "react-native-paper"
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


export default function TabTwoScreen() {
  const auth = useAuth()
  const router = useRouter()
  return (
    <>
      <View style={styles.container}>
        <UserInfo onPress={()=>{router.push("/meTab/userInfo")}} nickName={auth?.user?.nickname ?? ""} avatarUrl={auth?.user?.avatarUrl ?? ""}  />
      </View>
      <View style={styles.listView}>
      <List.Item left={() => <Feather name="star" size={scalefontSize(1.5)} color={MD2Colors.blue400} />} right={() => <AntDesign style={{lineHeight: scalefontSize(1.5)}} name="right" size={scalefontSize(1)} color="black" />} title="收藏"/>
      </View>
      </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: pTx(15),
    paddingRight: pTx(15),
    paddingTop: pTx(80),
    paddingBottom: pTx(10)
  },
  listView: {
    marginTop: pTx(10),
    paddingLeft: pTx(15),
    paddingRight: pTx(15),
  }
});
