import React, { useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { BarCodeScanner, BarCodeScannerResult } from "expo-barcode-scanner";

export default function BarCode() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: BarCodeScannerResult) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    await new Promise((r) => setTimeout(r, 2e3));
    router.push("/");
  };

  if (hasPermission === null) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator
          color={"#696969"}
        />
      </View>
    );
  }
  if (hasPermission === false) {
    alert("No access to the camera.");
    return router.push("/");
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button
          title={"Tap to Scan Again"}
          onPress={() => setScanned(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});
