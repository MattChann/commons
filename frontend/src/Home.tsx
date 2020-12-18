import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import axios from 'axios';
import { Redirect } from "react-router-dom";
import { Container, Image, Jumbotron, CardColumns, Col, Card } from 'react-bootstrap';

type Props = {
    readonly currUser: firebase.User,
    readonly logout: () => void;
};

type User = {
    id: string,
    name: string,
    email: string,
    photo: string,
    interests: string[],
    classes: string[],
    clubs: string[],
};

const Home = ({currUser, logout}: Props) => {
    const [loginChecked, setLoginChecked] = useState<boolean>(false);
    const [firstLogin, setFirstLogin] = useState<boolean>(true);
    const [thisUser, setThisUser] = useState<User>();
    const [commons, setCommons] = useState<User[]>([]);
    const [dataFetched, setDataFetched] = useState<boolean>(false);

    useEffect(() => {
        axios.get(`/getUser?id=${currUser.uid}`).then(user => {
            setFirstLogin(!Boolean(user.data));
            setLoginChecked(true);
            if (Boolean(user.data)) {
                setThisUser(user.data);
                axios.post("/getCommon", user.data).then(data => {
                    setCommons(data.data);
                    setDataFetched(true);
                });
            };
        });
    }, [currUser.uid]);

    if (loginChecked) {
        return (
            <div style={{backgroundColor: "#F1DAC4"}}>
                {firstLogin && <Redirect to="/signup"/>}
                <Container fluid style={{height: "25vh", backgroundColor: "#74DCFE", textAlign: "center"}}>
                    <br/><br/>
                    <Image src={thisUser?.photo} roundedCircle style={{borderRadius: "1rem"}}/><br/>
                    <h1>Hello {thisUser?.name}!</h1>
                    Find some cool people here to connect with!
                </Container><br/><br/><br/>
                
                <Container style={{textAlign: "center"}}>
                    <Jumbotron style={{borderRadius: "3rem", backgroundColor: "#F1DAC4", boxShadow: "10px 10px 50px #EBCBAD, -20px -20px 70px #FBF5EF", padding: "3rem"}}>
                        <h2>Your Recommended Connections:</h2>
                    </Jumbotron>
                </Container><br/><br/><br/>

                <Container>
                    <CardColumns>
                        {commons.map(user => (
                            <Col md key={user.id}>
                                <Card>
                                    <Card.Img variant="top" src={user.photo}/>
                                    <Card.Body>
                                        <Card.Title>{user.name}</Card.Title>
                                        <Card.Text>
                                            Interests:<br/>
                                            <ul>
                                            {user.interests.map(interest => (
                                                <li key={interest}>{interest}</li>
                                            ))}
                                            </ul>
                                            Classes:<br/>
                                            <ul>
                                            {user.classes.map(currClass => (
                                                <li key={currClass}>{currClass}</li>
                                            ))}
                                            </ul>
                                            Clubs:<br/>
                                            <ul>
                                            {user.clubs.map(club => (
                                                <li key={club}>{club}</li>
                                            ))}
                                            </ul>
                                        </Card.Text>
                                        <Card.Footer>
                                            Contact at: {user.email}
                                        </Card.Footer>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </CardColumns>
                </Container>
                <br/><br/>

                <div style={{textAlign: "center"}}>
                    <button style={{width: "75vw", height: "5vh"}} onClick={(e) => logout()}>Logout</button>
                </div><br/><br/><br/>
            </div>
        );
    } else {
        return (<div></div>);
    };
};

export default Home;