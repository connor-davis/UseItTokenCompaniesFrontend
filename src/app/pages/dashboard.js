import React, {useEffect, useState} from "react";

import {useSelector} from "react-redux";

import {selectItems} from "../slices/items.slice";
import {selectUser} from "../slices/user.slice.js";
import "../styles/dashboard.scss";
import "../styles/global.scss";
import {selectCollectors} from "../slices/collector.slice";

function Dashboard() {
    let user = useSelector(selectUser);
    let items = useSelector(selectItems);
    let collectors = useSelector(selectCollectors);
    let [countCollectors, setCountCollectors] = useState(0);
    let [countItems, setCountItems] = useState(0);

    useEffect(() => {
        setCountCollectors(collectors.length);
        setCountItems(items.length);
    }, [user, collectors, items]);

    return (
        <div className="dashboard-page">
            <div className="header">
                <div className="header-block">Dashboard</div>
            </div>

            <div className="row">
                <div className="stat-block">
                    <div className="stat-block-title">Collectors</div>
                    <div className="stat-block-content">{countCollectors}</div>
                </div>

                <div className="stat-block">
                    <div className="stat-block-title">Items</div>
                    <div className="stat-block-content">{countItems}</div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;