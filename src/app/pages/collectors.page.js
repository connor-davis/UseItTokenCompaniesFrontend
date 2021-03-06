import React from "react";

import {MdDelete, MdEdit, MdInfo,} from "react-icons/md";

import {useSelector} from "react-redux";

import {Link} from "react-router-dom";

import {API_URL, axios, fetchCollectors} from "../utils";
import {selectCollectors} from "../slices/collector.slice";
import {selectUser} from "../slices/user.slice";


function CollectorsPage() {
    let user = useSelector(selectUser);
    let collectors = useSelector(selectCollectors);

    function deleteCollector(uid) {
        axios.delete(API_URL + "/collector/" + uid, {
            headers: {
                "Authorization": "Bearer " + user.token,
                "secure_secret": user.secure_secret
            }
        }).then((result) => {
            if (result.data.success) fetchCollectors();
        }).catch((error) => console.log(error));
    }

    return (
        <div className="users-page">
            <div className="header">
                <div className="header-block">Collectors</div>
                <div className="header-block">
                    <Link to="/payCollector">
                        <button>Pay</button>
                    </Link>

                    <Link to="/createCollector">
                        <button>Create</button>
                    </Link>
                </div>
            </div>

            <table>
                <thead>
                <tr>
                    <th style={{width: "5%"}}>#</th>
                    <th style={{width: "15%"}}>Name</th>
                    <th style={{width: "15%"}}>Email</th>
                    <th style={{width: "20%"}}>Phone Number</th>
                    <th style={{width: "15%"}}>Balance</th>
                    <th style={{width: "20%"}}/>
                </tr>
                </thead>
                <tbody>
                {collectors.map((user, index) => (
                    <tr key={index}>
                        <td style={{width: "5%"}}>{index + 1}</td>
                        <td style={{width: "15%"}}>{user.name}</td>
                        <td style={{width: "15%"}}>{user.email}</td>
                        <td style={{width: "20%"}}>{user.phoneNumber}</td>
                        <td style={{width: "15%"}}>{user.balance || 0}</td>
                        <td style={{width: "20%"}}>
                            <Link to={{
                                pathname: "/collectorInfo/" + user.uid,
                            }}>
                                <button><MdInfo/></button>
                            </Link>
                            <Link to={{
                                pathname: "/editCollector/" + user.uid,
                            }}>
                                <button><MdEdit/></button>
                            </Link>
                            <button onClick={deleteCollector.bind(this, user.uid)}><MdDelete/></button>
                        </td>
                    </tr>))}
                </tbody>
            </table>

            {collectors.length === 0 ?
                <div
                    style={{
                        width: "100%",
                        height: "auto",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "10px",
                        marginBottom: "20px",
                        fontSize: "15px",
                        background: "rgba(0, 0, 0, 0.3)"
                    }}>No Collectors</div> :
                <div
                    style={{
                        width: "100%",
                        height: "auto",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "20px",
                    }}/>
            }
        </div>
    );
}

export default CollectorsPage;