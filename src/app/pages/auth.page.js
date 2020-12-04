import React, {useState} from "react";
import {useDispatch} from "react-redux";
import {Route} from "react-router";
import {API_URL, axios} from "../utils";
import {setUser} from "../slices/user.slice.js";

import "../styles/auth.scss";
import "../styles/global.scss";

function AuthPage() {
    let dispatch = useDispatch();
    let [email, setEmail] = useState("");
    let [password, setPassword] = useState("");

    async function authenticate() {
        await axios.post(API_URL + "/company/authenticate", {
            email, password
        }).then((response) => {
            if (response.data.success) {
                dispatch(setUser(response.data.data));
            }
        });
    }

    return (
        <div className="auth-page">
            <div className="blur-background"/>
            <div className="auth-form">
                <Route path="/" exact>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}/>

                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Password"
                        onChange={(p) => setPassword(p.target.value)}/>

                    <button onClick={authenticate.bind(this)}>Authenticate</button>
                </Route>
            </div>
        </div>
    );
}

export default AuthPage;