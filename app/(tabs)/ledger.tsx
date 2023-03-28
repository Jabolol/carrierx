import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text as DefaultText,
} from "react-native";
import { Text, View } from "../../components/Themed";
import { useEffect, useState } from "react";
import { colors, find, Options } from "../../utils";
import { useIsFocused } from "@react-navigation/native";

export default function TabTwoScreen() {
  const [ledger, setLedger] = useState<Options["ledger"][] | null>(null);
  const isFocused = useIsFocused();
  useEffect(() => {
    find("ledger").then(({ documents }) =>
      setLedger((documents as Options["ledger"][]).reverse())
    );
  }, [isFocused]);
  return (
    <>
      {ledger
        ? (
          <ScrollView>
            <View style={styles.container}>
              <Text style={styles.title}>Ledger</Text>
              <View
                style={styles.separator}
                lightColor="#eee"
                darkColor="rgba(255,255,255,0.1)"
              />
              {ledger.map(({ action, id }, index) => (
                <View style={styles.entryContainer} key={action + index}>
                  <View
                    style={{
                      ...styles.entryState,
                      backgroundColor: colors[action].bg,
                    }}
                  >
                    <DefaultText
                      style={{
                        ...styles.entryText,
                        color: colors[action].font,
                      }}
                    >
                      {action}
                    </DefaultText>
                  </View>
                  <Text>
                    {(() => {
                      const [s1, s2, s3] = id.split("-");
                      return "EvtID: " + [s1, s2, s3].join("-");
                    })()}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        )
        : (
          <View style={styles.spinnerContainer}>
            <ActivityIndicator
              color={"#696969"}
            />
          </View>
        )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  separator: {
    marginTop: 20,
    marginBottom: 10,
    height: 1,
    width: "80%",
  },
  entryContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    padding: 10,
    justifyContent: "center",
  },
  entryState: {
    backgroundColor: "#df000050",
    padding: 7.5,
    borderRadius: 7,
  },
  entryText: {
    color: "#df0000",
  },
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
