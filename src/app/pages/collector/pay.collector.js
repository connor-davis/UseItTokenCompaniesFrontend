import React, { useEffect, useState } from "react";

import BarcodeScannerComponent from "react-webcam-barcode-scanner";

import { useSelector } from "react-redux";

import { MdDelete } from "react-icons/md";

import { API_URL, axios, fetchCollectors, fetchDeposits, fetchItems } from "../../utils";
import { selectCollectors } from "../../slices/collector.slice";
import { selectItems } from "../../slices/items.slice";
import { selectUser } from "../../slices/user.slice";
import "../../styles/global.scss";
import "../../styles/user.info.scss";

function PayCollector({ history }) {
    let user = useSelector(selectUser);
    let collectors = useSelector(selectCollectors);
    let items = useSelector(selectItems);

    let [collector, setCollector] = useState(null);
    let [scannerData, setScannerData] = useState(null);
    let [depositList, setDepositList] = useState([]);
    let [shouldShowModal, setShouldShowModal] = useState(false);
    let [currentItem, setCurrentItem] = useState({});

    useEffect(() => {
        if (scannerData) {
            if (scannerData["text"] !== null) {
                setCollector(collectors.filter((filter) => filter.uid.substr(0, 13) === scannerData["text"])[0]);
            }
        }
    }, [collectors, scannerData]);

    function modifyItem(item) {
        setCurrentItem({ ...item, isDirty: false, kg: "" });
    }

    function addItemToDepositList(item) {
        if (item.isDirty) item.finalPrice = (item.price - 20) * item.kg;
        else item.finalPrice = item.price * item.kg;

        setDepositList([...depositList, { ...item }]);
        setCurrentItem({});
        closeModal();
    }

    function showModal() {
        setShouldShowModal(true);
    }

    function closeModal() {
        setShouldShowModal(false);
    }

    async function payCollector() {
        let amount = 0;

        let numHDP = 0;
        let numLDP = 0;
        let weightHDP = 0;
        let weightLDP = 0;

        depositList.forEach((x) => {
            switch (x.category) {
                case "HDP":
                    numHDP++;
                    weightHDP += parseInt(x.kg);
                    amount += x.finalPrice;
                    break;
                case "LDP":
                    numLDP++;
                    weightLDP += parseInt(x.kg);
                    amount += x.finalPrice;
                    break;
                default:
                    break;
            }
        });

        let deposit = {
            numbers: {
                HDP: parseInt(numHDP),
                LDP: parseInt(numLDP),
            },
            weights: {
                HDP: parseInt(weightHDP),
                LDP: parseInt(weightLDP),
            },
            amount,
        }

        await axios.put(API_URL + "/payment/deposit/" + collector.uid, deposit, {
            headers: {
                "Authorization": "Bearer " + user.token,
            },
        }).then((response) => {
            if (response.data.success) {
                fetchDeposits();
                fetchCollectors();
                fetchItems();
                history.push("/collectors");
            }
        }).catch((error) => console.log(error));
    }

    return collector ? <div className="user-info-page">
        {shouldShowModal ? <div className="user-info-card modal"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingBottom: "10px"
            }}>
            {currentItem.name ?
                <div className="item-modifiers"
                    style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                    <input
                        type="number"
                        name="kg"
                        value={currentItem.kg}
                        placeholder="Kg"
                        onChange={(e) => setCurrentItem({ ...currentItem, kg: e.target.value })} />

                    <label className="checkbox-container">Is Dirty
                            <input type="checkbox" checked={currentItem.isDirty}
                            onChange={(e) =>
                                setCurrentItem({ ...currentItem, isDirty: e.target.checked })
                            } />
                        <span className="checkmark" />
                    </label>

                    <div>
                        <button onClick={addItemToDepositList.bind(this, currentItem)}>Continue</button>
                        <button onClick={setCurrentItem.bind(this, {})}>Cancel</button>
                    </div>
                </div> : <>
                    <div className="modal-dropdown" style={{ marginBottom: "10px" }}>
                        <div className="modal-dropdown-hint">Hover To Select</div>
                        <div className="modal-dropdown-content">
                            {items.map((item, index) =>
                                <div key={index} className="modal-dropdown-content-item"
                                    onClick={modifyItem.bind(this, item)}>{item.name}</div>
                            )}
                        </div>
                    </div>
                    <button onClick={closeModal.bind(this)}>Cancel</button>
                </>}
        </div> :
            <div className="user-info-card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h3>Paying: {collector.name}</h3>

                <div className="user-deposit-list">
                    <div className="header">
                        <div className="header-block">Items</div>

                        <div className="header-block">
                            <button onClick={showModal.bind(this)}>Add</button>
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Value</th>
                                <th>Material</th>
                                <th>Kg</th>
                                <th>Final Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {depositList.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.category}</td>
                                    <td>{item.kg}</td>
                                    <td>{item.finalPrice}</td>
                                    <td>
                                        <button
                                            onClick={setDepositList.bind(this, depositList.filter((filter) => filter.name !== item.name))}>
                                            <MdDelete /></button>
                                    </td>
                                </tr>))}
                        </tbody>
                    </table>

                    {depositList.length === 0 ?
                        <div
                            style={{
                                width: "100%",
                                height: "auto",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                padding: "10px 0px",
                                marginBottom: "20px",
                                fontSize: "15px",
                                background: "rgba(0, 0, 0, 0.3)"
                            }}>No Items</div> :
                        <div
                            style={{
                                width: "100%",
                                height: "auto",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: "20px",
                            }} />
                    }

                    <div className="header">
                        <div className="header-block" />

                        <div className="header-block">
                            <button onClick={payCollector.bind(this)}>Pay</button>
                        </div>
                    </div>
                </div>
            </div>}
    </div> : <div className="user-info-page">
            <div className="user-info-card" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h3>Scan Barcode</h3>
                <BarcodeScannerComponent width={500} height={300} onUpdate={(error, result) => {
                    if (result) setScannerData(result);
                    else setScannerData("Not Found");
                }} />
            </div>
        </div>;
}

export default PayCollector;