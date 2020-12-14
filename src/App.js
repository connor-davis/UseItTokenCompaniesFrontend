import React, {useEffect} from 'react';

import {useSelector} from 'react-redux';

import {HashRouter} from 'react-router-dom';

import {fetchCollectors, fetchItems, fetchDeposits} from "./app/utils";
import AuthPage from './app/pages/auth.page';
import HomePage from './app/pages/home.page';
import {selectUser} from './app/slices/user.slice.js';
import Notification from "./app/pages/components/notification";

function App() {
    let user = useSelector(selectUser);

    useEffect(() => {
        if (user.uid) {
            fetchCollectors();
            fetchItems();
            fetchDeposits();
        }
    }, [user.uid]);

    return (
        <HashRouter>
            <Notification/>
            {
                user.uid ?
                    <HomePage/> :
                    <AuthPage/>
            }
        </HashRouter>
    );
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
}

export default App;
