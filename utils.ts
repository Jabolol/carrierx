import { createMongoDBDataAPI } from "mongodb-data-api";

type Carrier = typeof import("./assets/data/carriers.json")[0];
type Item = typeof import("./assets/data/items.json")[0];
type DefaultParcel = typeof import("./assets/data/parcel.json")[0];

interface Parcel extends Omit<DefaultParcel, "items"> {
  items: string[];
}

export type Options = {
  carriers: Omit<Carrier, "id"> & { _id?: { $oid: string }; id: string };
  items: Omit<Item, "id"> & { _id?: { $oid: string }; id: string };
  parcels: Omit<Parcel, "id"> & { _id?: { $oid: string }; id: string };
  ledger: {
    id: string;
    action:
      | "PARCEL_ADD"
      | "PARCEL_VIEW"
      | "ITEM_VIEW"
      | "DELIVERY_EXECUTE"
      | "DELIVERY_SUCCESS"
      | "DELIVERY_ERROR";
    date: number;
  };
  signatures: {
    id: string;
    signature: string;
    hash: string;
    date: number;
  };
};

const dataSource = "CHANGE_ME";
const database = "CHANGE_ME";

const client = createMongoDBDataAPI({
  apiKey: "CHANGE_ME",
  urlEndpoint: "CHANGE_ME",
});

export const findOne = <T extends keyof Options>(
  collection: T,
  filter: Partial<Options[T]>,
) =>
  client.findOne({
    dataSource,
    database,
    collection,
    filter,
  });

export const find = <T extends keyof Options>(
  collection: T,
  filter: Partial<Options[T]> = {},
) =>
  client.find({
    dataSource,
    database,
    collection,
    filter,
  });

export const insertMany = <T extends keyof Options>(
  collection: T,
  documents: (Omit<Options[T], "id"> & { id: string })[],
) =>
  client.insertMany({
    dataSource,
    database,
    collection,
    documents,
  });

export const isToday = (dateString: string) =>
  new Date(dateString).toDateString() === new Date().toDateString();

export const sortDates = <T extends { pickupDate: string }>(a: T, b: T) => {
  const split1 = a.pickupDate.split("/").map((x) => +x);
  const split2 = b.pickupDate.split("/").map((x) => +x);
  const date1 = new Date(split1[2], split1[0] - 1, split1[1]).getTime();
  const date2 = new Date(split2[2], split2[0] - 1, split2[1]).getTime();
  return date1 > date2 ? -1 : date1 === date2 ? 0 : 1;
};

export const randomDate = () => {
  const currentDate = new Date();
  const startOfLastMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1,
  );
  const randomTime = startOfLastMonth.getTime() +
    Math.random() * (currentDate.getTime() - startOfLastMonth.getTime());
  return new Date(randomTime);
};

export const colors: Record<
  Options["ledger"]["action"],
  { bg: string; font: string }
> = {
  PARCEL_ADD: {
    bg: "#17a2b820",
    font: "#17a2b8",
  },
  PARCEL_VIEW: {
    bg: "#17a2b820",
    font: "#17a2b8",
  },
  ITEM_VIEW: {
    bg: "#17a2b820",
    font: "#17a2b8",
  },
  DELIVERY_EXECUTE: {
    bg: "#ffc10720",
    font: "#ffc107",
  },
  DELIVERY_SUCCESS: {
    bg: "#28a74520",
    font: "#28a745",
  },
  DELIVERY_ERROR: {
    bg: "#dc354520",
    font: "#dc3545",
  },
};
