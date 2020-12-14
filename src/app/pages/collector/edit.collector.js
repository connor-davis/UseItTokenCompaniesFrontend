import React, {useEffect, useState} from "react";

import {useSelector} from "react-redux";

import {Link} from "react-router-dom";

import LoadingPage from "../loading.page";
import {API_URL, axios, fetchCollectors} from "../../utils";
import {selectCollectors} from "../../slices/collector.slice";
import {selectUser} from "../../slices/user.slice.js";
import "../../styles/global.scss";

function EditCollector({match, history}) {
    let [name, setName] = useState("");
    let [email, setEmail] = useState("");
    let [phoneNumber, setPhoneNumber] = useState("");
    let [accountNumber, setAccountNumber] = useState("");
    let [branchCode, setBranchCode] = useState("");

    let user = useSelector(selectUser);
    let collectors = useSelector(selectCollectors);

    let {uid} = match.params;

    useEffect(() => {
        if (uid) {
            let collector = collectors.filter((user) => {
                return uid === user["uid"];
            })[0];

            setName(collector.name);
            setEmail(collector.email);
            setPhoneNumber(collector.phoneNumber);
            setAccountNumber(collector.accountNumber);
            setBranchCode(collector.branchCode);
        }
    }, [uid, collectors]);

    function editCollector() {
        axios.put(API_URL + "/collector/" + uid, {name, email, phoneNumber, accountNumber, branchCode}, {
            headers: {
                "Authorization": "Bearer " + user.token,
            },
        }).then((response) => {
            if (response.data.success) {
                fetchCollectors();
                history.goBack();
            }
        }).catch((error) => console.log(error));
    }

    return name ? <div className="modify-item">
        <p className="title">Edit Collector</p>

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
                    <button onClick={editCollector.bind(this)}>Continue</button>
                    <Link to="/collectors"><button>Cancel</button></Link>
                </span>
    </div> : <LoadingPage/>;
}

export default EditCollector;