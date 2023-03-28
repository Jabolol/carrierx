import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Text as DefaultText,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "../components/Themed";
import { useState } from "react";
import { findOne, insertMany } from "../utils";
import { useRouter } from "expo-router";
import uuid from "react-native-uuid";

export default function ModalScreen() {
  const [parcel, setParcel] = useState<string>("");
  const [carrier, setCarrier] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <Text style={styles.title}>Add a parcel</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Text style={styles.subtitle}>Parcel ID</Text>
        <TextInput
          style={styles.input}
          placeholder="641DB7B2FC13"
          value={parcel}
          onChangeText={(t) => setParcel(t)}
        />
        <Text style={styles.subtitle}>Carrier ID</Text>
        <TextInput
          style={styles.input}
          placeholder="HET32R0G0U78"
          value={carrier}
          onChangeText={(t) => setCarrier(t)}
        />
        {error && <Text style={{ color: "#ff0000" }}>{error}</Text>}
      </View>
      <View style={styles.bottomView}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={async () => {
            const { document } = await findOne("carriers", {
              id: carrier.toLowerCase(),
            });
            if (!document) {
              setError("Invalid carrier ID");
              return;
            }
            if (!parcel.match(/^(\w{12})$/) || !carrier.match(/^(\w{12})$/)) {
              setError("IDs must match /^(\w{12})$/");
              return;
            }
            await insertMany("parcels", [{
              deliveryAdress: `St. Marina, ${
                Math.floor(Math.random() * 50) + 2
              }, Barcelona`,
              deliveryDate: `${Math.floor(Math.random() * 11) + 1}/${
                Math.floor(Math.random() * 30) + 1
              }/202${Math.floor(Math.random() * 3)}`,
              pickupAdress: `St. Solsones, ${
                Math.floor(Math.random() * 50) + 2
              }, Barcelona`,
              pickupDate: `${new Date().toLocaleDateString()}`,
              itemsCount: 2,
              items: [
                "fc13ae2238000168",
                "fc13ae2238000168",
              ],
              id: parcel.toUpperCase(),
            }]);
            await insertMany("ledger", [
              {
                action: "PARCEL_ADD",
                id: uuid.v4() as string,
                date: new Date().getTime(),
              },
            ]);
            router.back();
          }}
        >
          <DefaultText style={styles.buttonText}>Add</DefaultText>
        </TouchableOpacity>
      </View>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    padding: 20,
    width: "100%",
  },
  title: {
    fontSize: 20,
    padding: 5,
    fontWeight: "bold",
  },
  subtitle: {
    padding: 5,
    fontSize: 15,
    fontWeight: "normal",
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
  },
  input: {
    width: "100%",
    marginVertical: 10,
    borderRadius: 7.5,
    padding: 10,
    height: 50,
    borderColor: "#00000080",
    color: "#00000080",
    borderWidth: 2,
  },
  buttonContainer: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#df0000",
    padding: 10,
    bottom: 0,
    borderRadius: 10,
    marginBottom: 25,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  topView: {
    flex: 0.75,
  },
  bottomView: {
    flex: 0.25,
    alignItems: "center",
    justifyContent: "flex-end",
  },
});
