import { Ionicons, Feather } from '@expo/vector-icons';
import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import { scalefontSize } from '../../utils/style';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarStyle: {
          height: scalefontSize(5)
        }
        
      }}>
      <Tabs.Screen
        name="chatWelcome"
        options={{
          title: '聊天室',
          tabBarIcon: ({ color }) => <Ionicons name="chatbox-ellipses-outline" size={scalefontSize(2)} color={color} />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: "我的",
          tabBarIcon: ({ color }) => <Feather name="user" size={scalefontSize(2)} color={color} />,
          headerShown: false
        }}
      />
    </Tabs>
  );
}

const style = StyleSheet.create({
  tabIcon: {
     
  }
})
