import React, { useState, useEffect } from 'react';
import {Redirect} from "react-router-dom";
import firebase from 'firebase/app';
import axios from 'axios';

type Props = {
    readonly currUser: firebase.User,
};

const Signup = ({currUser}: Props) => {
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
                {!firstLogin && <Redirect to="/home"/>}
                <div>
                    Signup Page
                    {/* <button onClick={e => setFirstLogin(false)}>Register</button> */}
                </div>
            </div>
        );
    } else {
        return (<div></div>);
    }
};

export default Signup;