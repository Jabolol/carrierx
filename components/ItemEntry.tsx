import { MaterialCommunityIcons } from "@expo/vector-icons";
import Separator from "./Separator";
import { StyleSheet } from "react-native";
import { Text, View } from "./Themed";

const iconMap = {
  Smartwatch: "watch-variant",
  Phone: "cellphone",
  Television: "television",
  PC: "laptop",
} as const;

type ItemType = {
  itemId: string;
  weight: number;
  name: keyof typeof iconMap;
};

export default function ItemEntry(
  { itemId, weight, name }: ItemType,
) {
  return (
    <>
      <Separator />
      <View style={styles.container}>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            name={iconMap[name]}
            size={40}
            color="#df0000"
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.title}>{itemId}</Text>
          <Text style={styles.description}>
            {weight > 1000 ? `${(weight / 1000).toFixed(2)} kg` : `${weight} g`}
          </Text>
        </View>
      </View>
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
    backgroundColor: "#df000030",
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
