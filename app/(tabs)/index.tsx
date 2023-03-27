import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import ParcelEntry from "../../components/ParcelEntry";
import { Text, View } from "../../components/Themed";
import { find, isToday, Options, sortDates } from "../../utils";

export default function TabOneScreen() {
  const [data, setData] = useState<Options["parcels"][] | null>(null);
  useEffect(() => {
    find("parcels").then(({ documents }) =>
      setData(documents as Options["parcels"][])
    );
  }, []);
  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Parcel Lists</Text>
        {data
          ? data.sort(sortDates).map((
            { deliveryDate, pickupDate, itemsCount, _id },
            index,
          ) => (
            <ParcelEntry
              key={`${_id}-${index}`}
              title={`Parcel List ${pickupDate}`}
              description={`${itemsCount} carrier${itemsCount > 1 ? "s" : ""} ${
                isToday(pickupDate)
                  ? "will pickup the parcel today"
                  : `picked up the parcel on ${pickupDate}`
              }`}
              date={deliveryDate}
              items={itemsCount}
              _id={typeof _id === "string" ? _id : _id!["$oid"] ?? "notfound"}
            />
          ))
          : (
            <View style={styles.spinnerContainer}>
              <ActivityIndicator
                color={"#696969"}
              />
            </View>
          )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    padding: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    paddingLeft: 10,
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
