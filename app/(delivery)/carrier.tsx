import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Text as DefaultText,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "../../components/Themed";
import React, { useRef, useState } from "react";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";
import { useSearchParams } from "expo-router";
import { findOne, insertMany } from "../../utils";
import uuid from "react-native-uuid";
import md5 from "react-native-md5";
import { useRouter } from "expo-router";

export default function ModalScreen() {
  const [name, setName] = useState<string>("");
  const [plate, setPlate] = useState<string>("");
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const ref = useRef<SignatureViewRef>(null);
  const router = useRouter();
  const { c_id } = useSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.topView}>
        <Text style={styles.title}>Delivery Information</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Text style={styles.subtitle}>Driver's name</Text>
        <TextInput
          value={name}
          onChangeText={(n) => setName(n)}
          style={styles.input}
          placeholder="Manfred Steger"
        />
        <Text style={styles.subtitle}>License plate</Text>
        <TextInput
          style={styles.input}
          placeholder="3859FYH"
          value={plate}
          onChangeText={(n) => setPlate(n)}
        />
        <Text style={styles.title}>Driver's signature</Text>
        <SignatureScreen
          style={styles.signature}
          ref={ref}
          onEnd={() => ref.current?.readSignature()}
          onOK={(s) => setSignature(s)}
          autoClear={false}
        />
      </View>
      {error && <Text style={{ color: "#ff0000", padding: 10 }}>{error}</Text>}
      {success && (
        <Text style={{ color: "#00ff00", padding: 10 }}>{success}</Text>
      )}
      <View style={styles.bottomView}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={async () => {
            await insertMany("ledger", [{
              action: "DELIVERY_EXECUTE",
              date: new Date().getTime(),
              id: uuid.v4() as string,
            }]);
            if (!name || !plate) {
              setError("Fields must not be empty");
              return;
            }
            const { document } = await findOne("carriers", {
              licensePlate: plate.toLowerCase(),
              driver: name,
            });
            if (!document || document.id !== c_id) {
              await insertMany("ledger", [{
                action: "DELIVERY_ERROR",
                date: new Date().getTime(),
                id: uuid.v4() as string,
              }]);
              setError(
                "Invalid plate or invalid name provided.",
              );
              return;
            }
            const hash = md5.hex_md5(signature!);
            await insertMany("signatures", [{
              id: uuid.v4() as string,
              signature: `data:image/png;base64,${signature}`,
              hash,
              date: new Date().getTime(),
            }]);
            await insertMany("ledger", [{
              action: "DELIVERY_SUCCESS",
              date: new Date().getTime(),
              id: uuid.v4() as string,
            }]);
            setError("");
            setSuccess(`Successfully saved pick up by ${name} (${plate})`);
            await new Promise((r) => setTimeout(r, 3e3));
            router.push("/");
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
  signature: {
    width: "100%",
    height: 200,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: "#00000050",
    marginTop: 10,
  },
});
