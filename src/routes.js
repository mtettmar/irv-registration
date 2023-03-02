import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Register from './Register';
import Login from './Login'
import Dashboard from "./Dashboard";

//export const api_host = "untied2.eu.ngrok.io";
export const api_host = "api.untied.io";

// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

export default function BasicExample() {

    // get current path
    const path = window.location.pathname;
    console.log(path);

    // are we logged in (do we have a token in localstorage)
    const token = localStorage.getItem('token');
    console.log(token);


    return (
        <Router>
            <div>
                {path !== '/login' && token && (
                    <>      <nav className="navbar navbar-expand-lg navbar-light bg-light">

                        <ul className="navbar-nav mr-auto" style={{ flexDirection: "row", width:'100%' }}>
                            <li className="nav-item mx-2">
                                <Link to="/">Home</Link>
                            </li>
                            <li className="nav-item mx-2">
                                <Link to="/register">Register client</Link>
                            </li>

                            <li className="nav-item" style={{marginLeft:'auto', marginRight:10}}>
                                <span onClick={() => {
                                    localStorage.removeItem('token');
                                    window.location.href = '/login';
                                }} style={{color: "var(--bs-link-color)",
                                    textDecorationLine: "underline",
                                    cursor: "pointer"}}>Log out</span>
                            </li>

                        </ul>

                    </nav>

                        <hr />
                    </>

                )}
                {/*
          A <Switch> looks through all its children <Route>
          elements and renders the first one whose path
          matches the current URL. Use a <Switch> any time
          you have multiple routes, but you want only one
          of them to render at a time
        */}
                <Routes>
                    {/* <Route exact path="/">
            <Das />
          </Route> */}
          {token && (
            <>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/dash" element={<Dashboard />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    </>
            )}
            {!token && (
                <>
                    <Route path="/" element={<Login />} />
                    <Route path="/dash" element={<Login />} />
                    <Route path="/register" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    </>
            )}
                    {/* <Route path="/dashboard">
            <Dashboard />
          </Route> */}
                </Routes>
            </div>
        </Router>
    );
}


