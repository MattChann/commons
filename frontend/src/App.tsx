import React, { useState, useEffect } from 'react';
import 'firebase/auth';
import firebase from 'firebase/app';
import axios from 'axios';
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
    const [firstLogin, setFirstLogin] = useState<boolean>(false);

    function onAuthStateChange() {
        return firebase.auth().onAuthStateChanged((user) => {
            setCurrUser(user);
            if (user) {
                axios.get(`/getUser?id=${user.uid}`)
                    .then(userData => setFirstLogin(!Boolean(userData)));
            } else {
                setFirstLogin(false);
            };
        });
    };

    useEffect(() => onAuthStateChange(), []);

    return (
        <Router>
            <Switch>
                <Route path="/home">
                    {currUser && (<Home currUser={currUser}/>)}
                    {!currUser && (<Redirect to="/login"/>)}
                </Route>
                <Route path="/login">
                    {!currUser && (<Login/>)}
                    {(currUser && firstLogin) && (<Redirect to="/signup"/>)}
                    {(currUser && !firstLogin) && (<Redirect to="/home"/>)}
                </Route>
                <Route path="/signup">
                    {firstLogin && (<Signup/>)}
                    {!firstLogin && (<Redirect to="/home"/>)}
                    {!currUser && (<Redirect to="/login"/>)}
                </Route>
                <Route path="/">
                    <Landing/>
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
