import React, {useState} from "react";

import {useSelector} from "react-redux";

import {Link} from "react-router-dom";

import {API_URL, axios, fetchItems} from "../../utils";
import {selectUser} from "../../slices/user.slice.js";
import "../../styles/global.scss";
import "../../styles/item.scss";

function CreateItem({ history }) {
    let categories = ["HDP", "LDP"];
    let [name, setName] = useState("");
    let [itemValue, setItemValue] = useState(0);
    let [category, setCategory] = useState("");

    let user = useSelector(selectUser);

    async function createItem() {
        await axios.post(API_URL + "/items/", {name, price: itemValue, category}, {
            headers: {
                "Authorization": "Bearer " + user.token,
                "secure_secret": user.secure_secret,
            }
        }).then((response) => {
            if (response.data.success) {
                fetchItems();
                history.push("/items");
            }
        }).catch((error) => console.log(error));
    }

    return (
        <div className="modify-item">
            <p className="title">Create Product</p>

            <input
                type="text"
                name="name"
                value={name}
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}/>

            <input
                type="number"
                name="value"
                value={itemValue}
                placeholder="Item Value"
                onChange={(e) => {
                    if (e.target.value >= 0) setItemValue(e.target.value)
                }}/>

            <div className="dropdown-input" style={{marginBottom: "10px"}}>
                <div className="dropdown-input-hint">{category ? category : "Hover for Material"}</div>
                <div className="dropdown-input-content">
                    {categories.map((cat, index) =>
                        <div key={index} className="dropdown-input-content-item"
                             onClick={setCategory.bind(this, cat)}>{cat}</div>
                    )}
                </div>
            </div>

            <span>
                <button onClick={createItem}>Continue</button>
                <Link to="/items"><button>Cancel</button></Link>
            </span>
        </div>
    );
}

export default CreateItem;