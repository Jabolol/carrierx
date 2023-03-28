import { Text, View } from "../../components/Themed";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text as DefaultText,
  TouchableOpacity,
} from "react-native";
import { useRouter, useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { find, findOne, insertMany, Options } from "../../utils";
import ItemEntry from "../../components/ItemEntry";
import uuid from "react-native-uuid";

export default function Parcel() {
  const { id, c_id } = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<Options["parcels"] | null>(null);
  const [items, setItems] = useState<Options["items"][] | null>(null);

  useEffect(() => {
    findOne("parcels", { _id: { $oid: id as string } }).then(
      async ({ document }) => {
        const parcels = document as Options["parcels"];
        setData(parcels);
        setItems(
          // @ts-ignore: Special mongodb queries are not supported yet
          (await find("items", { "id": { $in: parcels.items } })).documents,
        );
        await insertMany("ledger", [{
          action: "ITEM_VIEW",
          id: uuid.v4() as string,
          date: new Date().getTime(),
        }]);
      },
    );
  }, []);

  return (
    data && items
      ? (
        <View style={styles.container}>
          <ScrollView style={styles.topView}>
            <Text style={styles.title}>{data.id}'s List</Text>
            {items.map((item) => (
              <ItemEntry
                key={item.id}
                weight={item.weigth}
                itemId={item.id}
                name={item.type as Parameters<typeof ItemEntry>[0]["name"]}
              />
            ))}
          </ScrollView>
          <View style={styles.bottomView}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => router.push(`/(delivery)/carrier?c_id=${c_id}`)}
            >
              <DefaultText style={styles.buttonText}>Delivery</DefaultText>
            </TouchableOpacity>
          </View>
        </View>
      )
      : (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator
            color={"#696969"}
          />
        </View>
      )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  topView: {
    flex: 0.75,
  },
  bottomView: {
    flex: 0.25,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bottomElement: {
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  description: {
    padding: 10,
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
});
