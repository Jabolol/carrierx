import { Text, View } from "../../components/Themed";
import { ActivityIndicator, ScrollView, StyleSheet } from "react-native";
import { useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { find, findOne, Options } from "../../utils";
import CarrierEntry from "../../components/CarrierEntry";

export default function Parcel() {
  const { id } = useSearchParams();
  const [data, setData] = useState<Options["parcels"] | null>(null);
  const [carriers, setCarriers] = useState<Options["carriers"][] | null>(null);

  useEffect(() => {
    findOne("parcels", { _id: { $oid: id as string } }).then(({ document }) =>
      setData(document as Options["parcels"])
    );
    find("carriers").then(({ documents }) =>
      setCarriers(documents as Options["carriers"][])
    );
  }, []);

  return (
    data && carriers
      ? (
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>List for {data.pickupDate}</Text>
            {carriers.map((carrier, index) => (
              <CarrierEntry
                key={`${carrier._id}-${index}`}
                title={`${data.id} items`}
                description={carrier.companyName}
                delivered={index % 2 === 1}
                items={data.itemsCount}
                path={`/(delivery)/items?id=${id}`}
              />
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
      )
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
});
