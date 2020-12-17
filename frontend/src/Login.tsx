import 'firebase/auth';
import firebase from 'firebase/app';
import FirebaseAuth from 'react-firebaseui/FirebaseAuth';

const uiConfig = {
    signInFlow: 'popup',
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

const Login = () => {
    return (
        <FirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    );
};

export default Login;