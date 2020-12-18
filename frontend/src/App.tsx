import React, { useState, useEffect } from 'react';
import 'firebase/auth';
import firebase from 'firebase/app';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Landing from './Landing';

const firebaseConfig = {
    apiKey: "AIzaSyBsyhx3Kbr_vokOxZNevJA2HITCiF5V7i8",
    authDomain: "commons-dti.firebaseapp.com",
    projectId: "commons-dti",
    storageBucket: "commons-dti.appspot.com",
    messagingSenderId: "279495477569",
    appId: "1:279495477569:web:43647f418b606f00b539c0"
};

firebase.initializeApp(firebaseConfig);

function App() {
    const [currUser, setCurrUser] = useState<firebase.User | null>(null);

    function onAuthStateChange() {
        return firebase.auth().onAuthStateChanged((user) => {
            setCurrUser(user);
        });
    };

    const logout = () => {
        firebase.auth().signOut()
            .then(() => setCurrUser(null));
    };

    useEffect(() => onAuthStateChange(), []);

    return (
        <Router>
            <Switch>
                <Route path="/home">
                    {currUser && <Home currUser={currUser} logout={logout}/>}
                    {!currUser && <Redirect to="/login"/>}
                </Route>
                <Route path="/login">
                    {!currUser && <Login/>}
                    {currUser && <Redirect to="/signup"/>}
                </Route>
                <Route path="/signup">
                    {currUser && <Signup currUser={currUser}/>}
                    {!currUser && <Redirect to="/login"/>}
                </Route>
                <Route path="/">
                    <Landing/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
