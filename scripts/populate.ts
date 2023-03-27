import { v4 } from "uuid";
import { insertMany, randomDate } from "../utils";
import type { Options } from "../utils";

const populateDatabase = async () => {
  console.log(
    await insertMany(
      "carriers",
      (await import("../assets/data/carriers.json")).default.map((
        { id, ...rest },
      ) => ({ ...rest, id: id["$oid"] })),
    ),
  );

  console.log(
    await insertMany(
      "items",
      (await import("../assets/data/items.json")).default.map((
        { id, ...rest },
      ) => ({ ...rest, id: id["$oid"] })),
    ),
  );

  console.log(
    await insertMany(
      "parcels",
      (await import("../assets/data/parcel.json")).default.map((
        { id, items, ...rest },
      ) => ({ ...rest, items: items.map((x) => x["$oid"]), id: id["$oid"] })),
    ),
  );

  const possibleStates: Options["ledger"]["action"][] = [
    "PARCEL_ADD",
    "PARCEL_VIEW",
    "ITEM_VIEW",
    "DELIVERY_EXECUTE",
    "DELIVERY_SUCCESS",
    "DELIVERY_ERROR",
  ];

  console.log(
    await insertMany(
      "ledger",
      Array.from({ length: 40 }, () => ({
        id: v4(),
        action:
          possibleStates[Math.floor(Math.random() * possibleStates.length)],
        date: randomDate().getDate(),
      })),
    ),
  );
};

populateDatabase();
