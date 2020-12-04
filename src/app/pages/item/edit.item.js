import React, {useEffect, useState} from "react";

import {useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {API_URL, axios, fetchItems} from "../../utils";

import {selectItems} from "../../slices/items.slice";
import {selectUser} from "../../slices/user.slice.js";

import "../../styles/global.scss";
import "../../styles/item.scss";


function EditItem({match, history}) {
    let [name, setName] = useState("");
    let [itemValue, setItemValue] = useState(0);
    let [category, setCategory] = useState("");

    let user = useSelector(selectUser);
    let items = useSelector(selectItems);

    let {id} = match.params;

    useEffect(() => {
        if (id) {
            let item = items.filter((item) => {
                return id === item["id"];
            })[0];

            setName(item.name);
            setItemValue(item.price);
            setCategory(item.category);
        }
    }, [id, items]);

    function editItem() {
        axios.put(API_URL + "/items/" + id, {name, price: itemValue, category}, {
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
            {name ? <div>
                <p className="title">Edit Product</p>

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

                <input
                    type="text"
                    name="material"
                    value={category}
                    placeholder="Material"
                    onChange={(e) => setCategory(e.target.value)}/>

                <span>
                    <button onClick={editItem}>Continue</button>
                    <Link to="/items"><button>Cancel</button></Link>
                </span>
            </div> : "LoadingPage..."}
        </div>
    );
}

export default EditItem;