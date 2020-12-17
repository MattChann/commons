import firebase from 'firebase/app';

type Props = {
    currUser: firebase.User | null,
};

const Home = ({currUser}: Props) => {
    return (
        <div>Home Page wassup</div>
    );
};

export default Home;