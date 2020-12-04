import React from "react";

import {VscOrganization} from "react-icons/vsc";
import {Link, Route, Switch} from "react-router-dom";
import {persistor} from "../store";
import {MdDashboard} from "react-icons/md";
import {useSelector} from "react-redux";

import {selectLoading} from "../slices/loading.slice";

import CreateCollector from "./collector/create.collector";
import NotFoundPage from "./not.found.page";
import Dashboard from "./dashboard";
import EditCollector from "./collector/edit.collector";
import LoadingPage from "./loading.page";
import CollectorsPage from "./collectors.page";

import "../styles/global.scss";
import "../styles/home.scss";
import ItemsPage from "./items.page";
import CreateItem from "./item/create.item";
import EditItem from "./item/edit.item";

function HomePage() {
    let loading = useSelector(selectLoading);

    function logout() {
        persistor.purge().then(r => console.log(r));
        window.location.href = "/";
    }

    return (
        <div className="home-page">
            <div className="blur-background"/>
            <div className="home-sidebar">
                <div className="sidebar-title">Companies Panel</div>
                <div className="sidebar-content">
                    <ul className="sidebar-list">
                        <Link to="/">
                            <div className="sidebar-list-item">
                                <MdDashboard/>
                                <p>Dashboard</p>
                            </div>
                        </Link>
                        <Link to="/collectors">
                            <div className="sidebar-list-item">
                                <VscOrganization/>
                                <p>Collectors</p>
                            </div>
                        </Link>
                        <Link to="/items">
                            <div className="sidebar-list-item">
                                <VscOrganization/>
                                <p>Items</p>
                            </div>
                        </Link>
                    </ul>
                </div>
                <div className="sidebar-footer">
                    <button onClick={logout} className="block">Logout</button>
                </div>
            </div>
            <div className="home-content">
                {!loading ? <Switch>
                    <Route path="/" exact><Dashboard/></Route>
                    <Route path="/collectors" component={(props) => <CollectorsPage {...props} />}/>
                    <Route path="/items" component={(props) => <ItemsPage {...props} />}/>
                    <Route path="/createCollector" component={(props) => <CreateCollector {...props} />}/>
                    <Route path="/editCollector/:uid" component={(props) => <EditCollector {...props} />}/>
                    <Route path="/createItem" component={(props) => <CreateItem {...props} />}/>
                    <Route path="/editItem/:id" component={(props) => <EditItem {...props} />}/>
                    <Route component={NotFoundPage}/>
                </Switch> : <LoadingPage/>}
            </div>
        </div>
    );
}

export default HomePage;