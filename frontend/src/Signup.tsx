import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import firebase from 'firebase/app';
import axios from 'axios';
import { Container, Jumbotron } from 'react-bootstrap';

type Props = {
    readonly currUser: firebase.User,
};

const Signup = ({currUser}: Props) => {
    // Checking first login of user
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

    // Interests
    const [interests, setInterests] = useState<string[]>([
        "Travel",
        "Art",
        "Sports",
        "Reading",
        "Music",
        "Outdoors",
    ]);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [interestAdding, setInterestAdding] = useState<string>("");

    const handleInterestAdding = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInterestAdding(event.currentTarget.value);
    };

    const addInterest = () => {
        if (interests.indexOf(interestAdding) === -1) {
            setInterests([...interests, interestAdding]);
        };
        setInterestAdding("");
    };

    const handleInterestSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (selectedInterests.indexOf(event.currentTarget.value) === -1) {
            setSelectedInterests([...selectedInterests, event.currentTarget.value]);
        } else {
            const copy = selectedInterests.slice();
            copy.splice(selectedInterests.indexOf(event.currentTarget.value), 1);
            setSelectedInterests([...copy]);
        };
    };

    // Classes
    const [classes, setClasses] = useState<string[]>([]);
    const [classAdding, setClassAdding] = useState<string>("");

    const handleClassAdding = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClassAdding(event.currentTarget.value);
    };

    const addClass = () => {
        if (classes.indexOf(classAdding) === -1) {
            setClasses([...classes, classAdding]);
        };
        setClassAdding("");
    };

    // Clubs
    const [clubs, setClubs] = useState<string[]>([]);
    const [clubAdding, setClubAdding] = useState<string>("");

    const handleClubAdding = (event: React.ChangeEvent<HTMLInputElement>) => {
        setClubAdding(event.currentTarget.value);
    };

    const addClub = () => {
        if (clubs.indexOf(clubAdding) === -1) {
            setClubs([...clubs, clubAdding]);
        };
        setClubAdding("");
    };

    // Register
    const register = () => {
        const user = {
            id: currUser.uid,
            name: currUser.displayName,
            email: currUser.email,
            photo: currUser.photoURL,
            interests: selectedInterests,
            classes: classes,
            clubs: clubs,
        };
        console.log(user);
        firebase
            .auth()
            .currentUser?.getIdToken(true)
            .then((idtoken) => {
                axios.post("/addUser", user, {headers: {
                    'Content-Type': 'application/json',
                    idtoken,
                }});
                setFirstLogin(false);
            })
            .catch(() => {
                console.log("Not Authenticated");
            });
    };


    if (loginChecked) {
        return (
            <div style={{backgroundColor: "#F1DAC4"}}>
                {!firstLogin && <Redirect to="/home"/>}
                <Container fluid style={{height: "15vh", backgroundColor: "#74DCFE", textAlign: "center"}}>
                    <br/><br/>
                    <h1>Welcome {currUser.displayName}!</h1>
                    Tell us a little more about you to provide accurate matches.
                </Container><br/><br/><br/>
                
                <Container>
                    <Container fluid>
                        <Jumbotron style={{borderRadius: "3rem", backgroundColor: "#F1DAC4", boxShadow: "10px 10px 50px #EBCBAD, -20px -20px 70px #FBF5EF", padding: "3rem"}}>
                            <h4>Add your interests:</h4><br/>
                            {interests.map(interest => (
                                <div key={interest}>
                                    <label>
                                        <input type="checkbox" id={interest} value={interest} onChange={handleInterestSelect}/> {interest}
                                    </label><br/>
                                </div>
                            ))}<br/>
                            <input type="text" value={interestAdding} placeholder="Add an Interest" onChange={handleInterestAdding}/>
                            <input type="submit" value="Add Interest" onClick={addInterest}/>
                        </Jumbotron>
                    </Container><br/><br/><br/>

                    <Container fluid>
                        <Jumbotron style={{borderRadius: "3rem", backgroundColor: "#F1DAC4", boxShadow: "10px 10px 50px #EBCBAD, -20px -20px 70px #FBF5EF", padding: "3rem"}}>
                            <h4>Add your classes:</h4><br/>
                            <input type="text" value={classAdding} placeholder="Add a Class" onChange={handleClassAdding}/>
                            <input type="submit" value="Add Class" onClick={addClass}/><br/>
                            <ul>
                                {classes.map(currClass => (
                                    <li key={currClass}>{currClass}</li>
                                ))}
                                <li><i>Added classes show up here (i.e. CS 2112)</i></li>
                            </ul>
                        </Jumbotron>
                    </Container><br/><br/><br/>

                    <Container fluid>
                        <Jumbotron style={{borderRadius: "3rem", backgroundColor: "#F1DAC4", boxShadow: "10px 10px 50px #EBCBAD, -20px -20px 70px #FBF5EF", padding: "3rem"}}>
                            <h4>Add your clubs:</h4><br/>
                            <input type="text" value={clubAdding} placeholder="Add a Club" onChange={handleClubAdding}/>
                            <input type="submit" value="Add Club" onClick={addClub}/><br/>
                            <ul>
                                {clubs.map(club => (
                                    <li key={club}>{club}</li>
                                ))}
                                <li><i>Added clubs show up here (i.e. DTI)</i></li>
                            </ul>
                        </Jumbotron>
                    </Container><br/><br/><br/>
                </Container>
                <div style={{textAlign: "center"}}>
                    <input type="submit" value="Register" style={{width: "75vw", height: "5vh"}} onClick={register}/>
                </div><br/><br/><br/>
            </div>
        );
    } else {
        return (<div></div>);
    }
};

export default Signup;