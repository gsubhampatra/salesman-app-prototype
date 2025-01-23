import ScannedList from '@/components/ScannedList';
import { primary } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Scan } from 'phosphor-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';


export default function TabTwoScreen() {
  const router = useRouter();
  return (
    <View style={{ padding: 30, backgroundColor: "white", minHeight: "100%", position: 'relative', alignItems: 'center' }}>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome</Text>
          <Text style={{ fontSize: 16 }}>Mahesh Kumar</Text>
        </View>
      </View>

      <ScannedList />

      <TouchableOpacity onPress={() => router.push("/(modals)/scanQr")} style={{ position: 'absolute', bottom: 30, padding: 10, borderRadius: 999 }}>
        <Scan size={52} color={`${primary}`} />
      </TouchableOpacity>

      <View style={{ marginTop: 30 }}>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

});