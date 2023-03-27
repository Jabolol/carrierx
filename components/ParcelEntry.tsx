import { StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Text, View } from "./Themed";
import Separator from "./Separator";

type ParcelType = {
  title: string;
  description: string;
  items: number;
  date: string;
  _id: string;
};

export default function ParcelEntry(
  { title, description, items, date, _id }: ParcelType,
) {
  const router = useRouter();
  return (
    <>
      <Separator />
      <TouchableOpacity onPress={() => router.push(`/(info)/parcel?id=${_id}`)}>
        <View style={styles.container}>
          <View style={styles.info}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>
              {description}
            </Text>
            <Text style={styles.description}>
              {`${items} item${items > 1 ? "s" : ""}`}
            </Text>
          </View>
          <Text style={styles.date}>{date}</Text>
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
  info: {
    width: "75%",
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
