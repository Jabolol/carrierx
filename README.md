# The ultimate App

> **Note**
> 
> **1st place** for the
> [`React Native`](https://nuwe.io/dev/competitions/mediamarkt-letsgo-hackathon) category at **Let's Go** Hackathon, organized by **Mediamarkt**

CarrierX is a `React Native` mobile application coded using `TypeScript` and
`Solidity`. Its aim is to help Mediamarkt's employees have an easier time
managing all the paraphernalia related to carriers and deliveries, while being
_secure_, _efficient_ and _beautiful_.

# Contents

- [Basic features](#basic-features)
- [Extras](#extras)
- [Even more extras](#even-more-extras)
- [Setup](#setup)
- [Blockchain ledger](#blockchain-ledger)
- [Code quality](#code-quality)
- [Security](#security)
- [Wrapping off](#wrapping-off)

# Basic Features

> Note: All features are production ready. State is persisted on MongoDB. Please
> refer to **Setup**

- [x] Parcel inventory managing
  - [x] Parcel addition
    - [x] Add validated carrier information
    - [x] Add validated parcel information
  - [x] Parcel listing
  - [x] Parcel handover state
- [x] Parcel validation
  - [x] Assignment to valid carrier
  - [x] Valid parcel properties
- [x] Pickup validation
  - [x] Driver name and plate validation

# Extras

> Note: These only include the **listed** extra ideas

- [x] Handover with signature
  - [x] Persistent signature storage
  - [x] Signature integrity with hashes
- [x] Advanced overall validation
  - [x] Parcel ID Regex
  - [x] Driver ID Regex
  - [x] Exact driver name expected
  - [x] Exact driver plate expected
- [x] Parcel bar code scanner

# Even More Extras

> Note: These extras greatly extend the main app idea and improve the user
> experience and security.

- [x] Production Ready
  - [x] State saved on MongoDB
  - [x] Actions reflect instantly
  - [x] Ability to execute actions
- [x] Blockchain ledger PoC
  - [x] Custom Solidity Smart Contract
  - [x] Deployed to the Goerli network
  - [x] Verified on EtherScan
- [x] Immutable ledger for main actions
  - [x] Improve transparency
  - [x] Main actions
    - [x] PARCEL_ADD: Scan QR and add parcel
    - [x] PARCEL_VIEW: View contents of parcel
    - [x] ITEM_VIEW: View single item
    - [x] DELIVERY_EXECUTE: Deliver (add carrier info)
    - [x] DELIVERY_SUCCESS: Delivery given to carrier
    - [x] DELIVERY_ERROR: Info is wrong
    - [x] DELIVERY_CONFIRMED: Delivery confirmed by carrier
- [x] Dark Mode
- [x] Fully responsive
  - [x] Supports multiple screen resolutions
  - [x] Supports iOS + Android
- [x] Completely typesafe

# Setup

Since this app is production ready, the setup is a little bit longer.

To start with install all the necessary modules:

```sh
yarn
# npm install
```

1. Create a MongoDB atlas database. Please note the `Cluster` name down.
2. Enable the `Data API` and create a new `API_KEY` with **read and write**
   access.
   [Here's](https://www.mongodb.com/docs/atlas/api/data-api/#get-started) the
   official documentation.
3. Install Atlas and connect to your database using the `URI` in MongoDB's web
   console.
   [Here’s](https://www.mongodb.com/docs/atlas/tutorial/connect-to-your-cluster/)
   the official documentation. Select `Compass` for the driver option.
4. After successfully connecting. Create a new
   [collection](https://www.mongodb.com/docs/atlas/atlas-ui/collections/) named
   `items` and a new
   [database](https://www.mongodb.com/docs/atlas/atlas-ui/databases/). Note the
   name down with the `Cluster` name of step 1.
5. Under the newly created `database`, create 4 `collections`, named:
   - carriers
   - parcels
   - ledger
   - signatures

> Note: The names are case sensitive

> Note: The required structure is a database with 5 collections inside:
> **items**, **parcels**, **ledger**, **carriers** and **signatures**

> Note: Here's how the entries should look like under a database named **data**:
>
> ![](/assets/images/mongo.png)

6. Go to `./utils.ts` and change all variables with value `CHANGE_ME` (L:34 and
   onwards) for the required values. Do not remove the quotes, place the content
   inside.
7. Time to populate the database with predefined values. Run:

```sh
yarn run populate
# npm run populate
```

> Note: This will add the provided data to the database to be able to use the
> app

> Note: The **urlEndpoint** should end with **/endpoint/data/v1**

8. Run the app

```sh
npx expo start
```

9. Download Expo Go and scan the QR like stated
   [here](https://docs.expo.dev/workflow/expo-go/) or use one of the builtin
   emulators. Installing them is out of the scope of this guide.

# Blockchain Ledger

This application comes with a builtin ledger for all notable actions. This means
that every time an employee does an action such as adding a parcel, delivering
correctly or delivering incorrectly a parcel, it gets logged, and saved.

A proof of concept (PoC) exists under the `blockend` directory. It features a
custom smart contract that is already deployed on the `Goerli` network. It keeps
tracks immutably and transparently of all actions. More info about the contract
can be seen
[here](https://goerli.etherscan.io/address/0x6206325fc24d09a65864791cC73961beC04fDD92).

The idea is to implement a ledger on the blockchain `company-wide`. This would
allow to quickly track down actions in case of errors, as well as cracking down
on fraud. Moreover, due to its immutable nature, it would have the last word and
guarantee a transparent `zero-trust` solution. It could easily be implemented to
the `public`, so that they can keep track of their parcels without having to
"trust" intermediary companies, such as the delivery one.

# Code quality

One of, if not the most, important aspects of code is quality. Therefore, this
mobile application has been created using `TypeScript` and the latest
`ECMAScript` features.

Advanced features such as `generics`, `builtin` types and `mapped` types have
been used to ensure maintainability and ease of understanding.

# Security

Another key aspect of every application is security. Taking this into account,
the application has been designed taking `security` and `transparency` greatly
into consideration. Some security features are `plate` and `name` validation
upon delivery, `signature` hashing to preserve the integrity of the signature
and `immutable` event logging. On the event of an incorrect delivery (eg: wrong
plate, wrong driver name), the event gets logged and displayed as an error on
the ledger, so that `employees` are aware and can take the necessary actions.

# Wrapping off

This hackathon was a lot of fun, and the `blockchain` PoC would be a great
addition to any existing application. Furthermore, designing and implementing a
full stack application using typescript is marvelous, completely recommend it.
