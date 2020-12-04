import React, {useEffect} from 'react';

import {useSelector} from 'react-redux';
import {HashRouter} from 'react-router-dom';

import {fetchCollectors, fetchItems} from "./app/utils";

import AuthPage from './app/pages/auth.page';
import HomePage from './app/pages/home.page';

import {selectUser} from './app/slices/user.slice.js';
import Notification from "./app/pages/components/notification";

function App() {
    let user = useSelector(selectUser);

    useEffect(() => {
        if (user.role) {
            fetchCollectors();
            fetchItems();
        }
    }, [user.role]);

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

export default App;
