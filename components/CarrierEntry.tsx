import { MaterialCommunityIcons } from "@expo/vector-icons";
import Separator from "./Separator";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "./Themed";

type CarrierType = {
  title: string;
  description: string;
  items: number;
  delivered: boolean;
  path: string;
};

export default function CarrierEntry(
  { title, description, items, delivered, path }: CarrierType,
) {
  const router = useRouter();
  return (
    <>
      <Separator />
      <TouchableOpacity onPress={() => router.push(path)}>
        <View style={styles.container}>
          <View style={styles.icon}>
            <MaterialCommunityIcons
              name="truck-cargo-container"
              size={40}
              color="red"
            />
          </View>
          <View style={styles.info}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>
              {description}
            </Text>
            <Text style={styles.description}>
              {`${items} item${items > 1 ? "s" : ""} to be delivered`}
            </Text>
          </View>
          <Text
            style={{
              ...styles.date,
              color: !delivered ? styles.date.color : "#3a354161",
            }}
          >
            {delivered ? "delivered" : "delivery"}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  icon: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#ff000030",
  },
  info: {
    width: "50%",
    flex: 1,
    flexDirection: "column",
    gap: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  description: {
    opacity: .6,
  },
  date: {
    color: "#df0000",
    fontWeight: "bold",
  },
});
