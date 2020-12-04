import React, {useState} from "react";

import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {API_URL, axios, fetchCollectors} from "../../utils";

import {selectUser} from "../../slices/user.slice.js";

import "../../styles/global.scss";
import "../../styles/item.scss";

function CreateCollector({history}) {
    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [phoneNumber, setPhoneNumber] = useState("");
    let [accountNumber, setAccountNumber] = useState("");
    let [branchCode, setBranchCode] = useState("");
    let [password, setPassword] = useState("");

    let user = useSelector(selectUser);

    async function createCollector() {
        if (name !== "" && email !== "" && phoneNumber !== "" && password !== "") {
            await axios.post(API_URL + "/collector/create", {name, email, phoneNumber, accountNumber, branchCode, password}, {
                headers: {
                    "Authorization": "Bearer " + user.token,
                    "secure_secret": user.secure_secret,
                }
            }).then((response) => {
                if (response.data.success) {
                    fetchCollectors();
                    history.goBack();
                }
            }).catch((error) => console.log(error));
        }
    }

    return (
        <div className="modify-item">
            <p className="title">Create Collector</p>

            <input
                type="text"
                name="name"
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}/>

            <input
                type="text"
                name="email"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}/>

            <input
                type="tel"
                name="phoneNumber"
                value={phoneNumber}
                placeholder="Phone Number"
                onChange={(e) => setPhoneNumber(e.target.value)}/>

            <input
                type="text"
                name="password"
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}/>

            <input
                type="text"
                name="accountNumber"
                value={accountNumber}
                placeholder="Account Number"
                onChange={(e) => setAccountNumber(e.target.value)}/>

            <input
                type="text"
                name="branchCode"
                value={branchCode}
                placeholder="Branch Code"
                onChange={(e) => setBranchCode(e.target.value)}/>

            <span>
                <button onClick={createCollector.bind(this)}>Continue</button>
                <Link to="/collectors"><button>Cancel</button></Link>
            </span>
        </div>
    );
}

export default CreateCollector;