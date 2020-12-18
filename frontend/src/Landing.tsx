import { Container, Jumbotron } from 'react-bootstrap';

const Landing = () => {
    return (
        <div>
            <Container fluid style={{height: "15vh", backgroundColor: "#74DCFE", textAlign: "center"}}>
                <br/><br/>
                <h1>Commons</h1>
                A platform for Cornell Students to meet others and connect based on common ground like interests, classes, or clubs.
            </Container><br/><br/><br/>

            <Container>
                <Jumbotron style={{textAlign: "center", borderRadius: "3rem", backgroundColor: "#F1DAC4", boxShadow: "10px 10px 50px #EBCBAD, -20px -20px 70px #FBF5EF", padding: "3rem"}}>
                    <h2>Login to start matching:</h2><br/>
                    <a href="/login">
                        <button>Login</button>
                    </a>
                </Jumbotron>
            </Container>
        </div>
    );
};

export default Landing;