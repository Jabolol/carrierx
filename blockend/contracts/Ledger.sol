// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Ledger {

    enum State {
        PARCEL_ADD, // scan qr -> add parcel
        PARCEL_VIEW, // view contents of parcel
        ITEM_VIEW, // view single item
        DELIVERY_EXECUTE, // deliver (add carrier info)
        DELIVERY_SUCCESS, // delivery given to carrier
        DELIVERY_ERROR, // info is wrong
        DELIVERY_CONFIRMED // delivery confirmed by carrier
    }

    event update(State state, string userId, uint32 date, uint32 itemId);

    address public owner;

    mapping (address => bool) isWhitelistedWorker;
    mapping (address => bool) isActiveCarrier;
    mapping (uint256 => bool) isParcelExists;
    mapping (uint256 => bool) isCarrierExists;
    mapping (uint256 => Parcel) parcels;
    uint32 nextParcelId = 0;

    mapping (address => Carrier) carriers;

    struct Carrier {
        string name;
        bool isActive;
    }

    struct Parcel {
        uint32 id;
        string userId;
        uint32 date;
        uint32 itemId;
        State state;
    }

    constructor(address _owner) {
        owner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can update state");
        _;
    }


    modifier onlyCarrier() {
        require(carriers[msg.sender].isActive, "Only active carriers can confirm delivery");
        _;
    }

    modifier onlyActiveCarrierOrOwner() {
        require(carriers[msg.sender].isActive || msg.sender == owner, "Only active carriers can confirm delivery");
        _;
    }

    function addParcel(string memory _userId, uint32 _date, uint32 _itemId) public onlyActiveCarrierOrOwner {
        Parcel memory newParcel = Parcel(nextParcelId, _userId, _date, _itemId, State.PARCEL_ADD);
        parcels[nextParcelId] = newParcel;
        isParcelExists[nextParcelId] = true;
        nextParcelId++;
        emit update(newParcel.state, newParcel.userId, newParcel.date, newParcel.itemId);
    }

    function viewParcel(uint256 _id) public view returns (string memory, uint256, uint256, State) {
        require(isParcelExists[_id], "Parcel not found");
        return (parcels[_id].userId, parcels[_id].date, parcels[_id].itemId, parcels[_id].state);
    }

    function viewItem(uint256 _id) public view returns (State) {
        require(isParcelExists[_id], "Parcel not found");
        return parcels[_id].state;
    }

    function executeDelivery(uint256 _id, string memory _carrierName) public onlyActiveCarrierOrOwner {
        require(isParcelExists[_id], "Parcel not found");
        parcels[_id].state = State.DELIVERY_EXECUTE;
        carriers[msg.sender].name = _carrierName;
        carriers[msg.sender].isActive = true;
        isCarrierExists[_id] = true;
        emit update(parcels[_id].state, parcels[_id].userId, parcels[_id].date, parcels[_id].itemId);
    }

    function confirmDelivery(uint256 _id) public onlyCarrier {
        require(isParcelExists[_id], "Parcel not found");
        require(isCarrierExists[_id], "Carrier not found");
        parcels[_id].state = State.DELIVERY_CONFIRMED;
        carriers[msg.sender].isActive = false;
        emit update(parcels[_id].state, parcels[_id].userId, parcels[_id].date, parcels[_id].itemId);
    }

    function reportDeliveryError(uint256 _id) public onlyActiveCarrierOrOwner {
        require(isParcelExists[_id], "Parcel not found");
        parcels[_id].state = State.DELIVERY_ERROR;
        emit update(parcels[_id].state, parcels[_id].userId, parcels[_id].date, parcels[_id].itemId);
    }

    function removeParcel(uint256 _id) public onlyActiveCarrierOrOwner {
        require(isParcelExists[_id], "Parcel not found");
        isParcelExists[_id] = false;
        delete parcels[_id];
    }

    function addCarrier(address _carrierAddress, string memory _name) public onlyOwner {
        Carrier memory newCarrier = Carrier(_name, true);
        carriers[_carrierAddress] = newCarrier;
    }

    function removeCarrier(address _carrierAddress) public onlyOwner {
        require(carriers[_carrierAddress].isActive == false, "Carrier is currently active and cannot be removed");
        delete carriers[_carrierAddress];
    }

    function updateCarrierStatus(address _carrierAddress, bool _status) public onlyOwner {
        require(carriers[_carrierAddress].isActive == true, "Carrier not found");
        carriers[_carrierAddress].isActive = _status;
    }

    function updateCarrierName(address _carrierAddress, string memory _name) public onlyOwner {
        require(carriers[_carrierAddress].isActive == true, "Carrier not found");
        carriers[_carrierAddress].name = _name;
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function isParcelExisting(uint256 _id) public view returns (bool) {
        return isParcelExists[_id];
    }

    function isCarrierActive(address _carrierAddress) public view returns (bool) {
        return carriers[_carrierAddress].isActive;
    }

    function getCarrierName(address _carrierAddress) public view returns (string memory) {
        return carriers[_carrierAddress].name;
    }

}
