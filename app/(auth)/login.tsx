import { postLogin } from "@/lib/http/mutations";
import { useMutation } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import { useState } from "react";
import { NativeSyntheticEvent, StyleSheet, Text, TextInput, TextInputChangeEventData, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig } from "@/constants/AppConfig";
import { primary } from "@/constants/Colors";
import { useUserStore } from "@/store";
import { useRouter } from "expo-router";

export default function LoginScreen() {

  const { setIsLogedIn } = useUserStore();
  const [uid, setUid] = useState<string>();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: postLogin,
    onSuccess: async (data: { token: string }) => {
      console.log(data);
      await AsyncStorage.setItem(AppConfig.TOKEN_NAME, JSON.stringify(data.token));
      setIsLogedIn(true);
      router.push("/(tabs)");
    },
    onError: (error) => {
      console.log(error.stack);
    }
  })

  const handleLoginPress = () => {
    console.log(uid);
    if (uid ) {
      loginMutation.mutate({ uid });
    }
  }

  const handleUidChange = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    setUid(e.nativeEvent.text);
  }

  return (
    <View style={style.container}>
      <View style={style.headingHolder}>
        <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>Welcome</Text>
        <Text style={{ fontSize: 40, fontWeight: 'bold', color: 'white' }}>Back</Text>
        <Text style={{ fontSize: 14, color: 'white' }}>we track sales this is just a prototype application</Text>
      </View>
      <View style={{ backgroundColor: 'white', padding: 30, width: "100%", gap: 20, height: "50%" }}>
        <TextInput placeholder="phone" onChange={handleUidChange} style={style.input} />
        <Button title="Login" onPress={handleLoginPress} btnStyle={{ backgroundColor: primary }} textStyle={{ color: "white" }} />
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#2b7cff",
    justifyContent: "flex-end",
    alignItems: "baseline",
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
  },
  headingHolder: {
    marginBottom: 50,
    padding: 30,
  },
})