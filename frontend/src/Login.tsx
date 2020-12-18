import 'firebase/auth';
import firebase from 'firebase/app';
import FirebaseAuth from 'react-firebaseui/FirebaseAuth';
import { Container, Jumbotron } from 'react-bootstrap';

const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

const Login = () => {
    return (
        <Container>
            <br/><br/><br/><br/><br/>
            <Jumbotron style={{textAlign: "center", borderRadius: "3rem", backgroundColor: "#F1DAC4", boxShadow: "10px 10px 50px #EBCBAD, -20px -20px 70px #FBF5EF", padding: "3rem"}}>
                <h1>Login Here:</h1>
                <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
            </Jumbotron>
        </Container>
    );
};

export default Login;