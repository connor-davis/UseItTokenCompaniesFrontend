import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer
} from 'recharts';

import { selectCollectors } from "../slices/collector.slice";
import { selectDeposits } from "../slices/deposits.slice";
import { selectItems } from "../slices/items.slice";
import { selectUser } from "../slices/user.slice.js";
import "../styles/dashboard.scss";
import "../styles/global.scss";

const ChartTooltip = ({ active, payload, label }) => {
    let makeUnit = (e) => {
        return e.payload.unit ? e.payload.unit : "";
    }

    if (active) {
        if (payload !== null) {
            if (payload.length > 1) {
                return (
                    <div className="chart-tooltip">
                        <div className="chart-tooltip-content">
                            {payload.map((p) => (<div key={p.color} style={{ color: p.color }}>{p.name + ": " + p.value + "" + makeUnit(p)}</div>))}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="chart-tooltip">
                        <p className="chart-tooltip-label">{payload[0].name + ": " + payload[0].value}</p>
                    </div>
                );
            }
        }
    }

    return null;
};

function totalNums(array, cb) {
    let totals = [];

    for (let i = 0; i < array.length; i++) {
        let dates = `${array[i].createdOn.split(" ")[1] + array[i].createdOn.split(" ")[3]}`;

        if (!totals[dates]) {
            totals[dates] = [];
        }

        totals[dates].push(array[i]);
    }

    cb(totals);
}

function usersMonthly(array, cb) {
    let monthly = [];
    let i = 0;

    for (let total in array) {
        monthly[i] = { name: total, Total: array[total].length };
        i++;
    }

    cb(monthly);
}

function weightsMonthly(array, cb) {
    let monthly = [];
    let HDP = 0;
    let LDP = 0;
    let i = 0;

    for (let total in array) {
        for (let e = 0; e < array[total].length; e++) {
            let deposit = array[total][e];

            for (let weight in deposit.weights) {
                if (weight === "HDP") HDP += deposit.weights[weight];
                if (weight === "LDP") LDP += deposit.weights[weight];
            }
        }

        monthly[i] = { name: total, HDP, LDP, unit: "kg" };
        i++;
    }

    cb(monthly);
}

function Dashboard() {
    let user = useSelector(selectUser);
    let items = useSelector(selectItems);
    let collectors = useSelector(selectCollectors);
    let deposits = useSelector(selectDeposits);
    let [companiesCollectors, setCompaniesCollectors] = useState([]);
    let [companiesWeights, setCompaniesWeights] = useState([]);
    let [countCollectors, setCountCollectors] = useState(0);
    let [countItems, setCountItems] = useState(0);

    useEffect(() => {
        if (collectors.length > 0) {
            let totals = [];
            totalNums(collectors, val => totals = val);

            let monthly = [];
            usersMonthly(totals, val => monthly = val);

            setCompaniesCollectors(monthly);
        } else {
            setCompaniesCollectors([]);
        }

        if (deposits.length > 0) {
            let totals = [];
            totalNums(deposits.filter((filter) => filter.company === user.name), val => totals = val);

            let monthly = [];
            weightsMonthly(totals, val => monthly = val);

            setCompaniesWeights(monthly);
        } else {
            setCompaniesWeights([]);
        }
        
        setCountCollectors(collectors.length);
        setCountItems(items.length);
    }, [user, collectors, items, deposits]);

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

            <div className="row">
                <div className="stat-block">
                    <div className="stat-block-title">Monthly Collectors</div>
                    <div className="stat-block-content" style={{ width: "100%" }}>
                        <ResponsiveContainer width={"100%"} height={400}>
                            <LineChart
                                data={companiesCollectors}
                                margin={{
                                    top: 30, right: 5, left: 5, bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis dataKey="Total" />
                                <Tooltip content={<ChartTooltip />} />
                                <Legend />
                                <Line type="monotone" dataKey="Total" stroke="#95d2ac" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="stat-block">
                    <div className="stat-block-title">Monthly Weights</div>
                    <div className="stat-block-content" style={{ width: "100%" }}>
                        <ResponsiveContainer width={"100%"} height={400}>
                            <BarChart
                                data={companiesWeights}
                                margin={{
                                    top: 30, right: 30, left: 20, bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip content={<ChartTooltip />} />
                                <Legend />
                                <Bar dataKey="HDP" fill="#F4D03F" />
                                <Bar dataKey="LDP" fill="#27AE60" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Dashboard;