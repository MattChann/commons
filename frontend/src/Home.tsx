import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import axios from 'axios';
import {Redirect} from "react-router-dom";

type Props = {
    readonly currUser: firebase.User,
    readonly logout: () => void;
};

const Home = ({currUser, logout}: Props) => {
    const [loginChecked, setLoginChecked] = useState<boolean>(false);
    const [firstLogin, setFirstLogin] = useState<boolean>(true);

    useEffect(() => {
        axios.get(`/getUser?id=${currUser.uid}`).then(user => {
            setFirstLogin(!Boolean(user.data));
            // console.log(user);
            // console.log(user.data);
            setLoginChecked(true);
        });
    }, [currUser.uid]);

    if (loginChecked) {
        return (
            <div>
                {!firstLogin && <Redirect to="/signup"/>}
                Home Page wassup
                <button onClick={(e) => logout()}>Logout</button>
            </div>
        );
    } else {
        return (<div></div>);
    };
};

export default Home;