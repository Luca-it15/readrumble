import React from 'react';
import User from '../components/User';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../App.css'
const user = {
  firstName: 'Mario',
  lastName: 'Rossi',
  email: 'mario.rossi@example.com',
  image: 'https://example.com/profile.jpg'
};

const ProfilePage = () => {
  return (
    <Container fluid>
        <Row>
            <Col>
                <User {...user} />
            </Col>
        </Row>

        <Row>
            <Col>
                <Row>
                    <h1>Amici</h1>
                </Row>
                <Row>
                    <h1>Competizioni</h1>
                </Row>
            </Col>
            <Col>

                <h2>Post</h2>
            </Col>
            <Col>
                <Row>
                    <h1>Libri Preferiti</h1>
                </Row>
                <Row>
                    <h1>Libri Letti</h1>
                </Row>
            </Col>
        </Row>
    </Container>
  );
}

export default ProfilePage;
