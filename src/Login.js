import React from "react";
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { api_host } from './routes';

// create a login component
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const doLogin = () => {
        console.log("doLogin");
        const payload = {
            "email": email,
            "password": password
        }
        console.log(payload)
        console.log(api_host)
        fetch(`https://${api_host}/irv-registration/login.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log(data);
                    const token = data.token;
                    //store token in local storage
                    localStorage.setItem('token', token);
                    localStorage.setItem('email', email);
                    // navigate to /dashboard
                    window.location.href = '/dash';

                } else {
                    console.log(data);
                    alert('Login failed - please try again!')
                }
            })
    }


    return (
        <div>

            <Container fluid="sm" style={{ maxWidth: 600 }}>

                <Row className="mt-2">
                    <img src={require('./asrlogo.svg').default} alt="untied logo" /> <br />
                </Row>

                <Row className="mt-4">
                    <Col>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={email} onChange={(
                                    e) => {
                                    setEmail(e.target.value);
                                }} />

                            </Form.Group>

                            <Form.Group controlId="formBasicPassword" className="mt-4">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
                            </Form.Group>

                            <Button variant="primary" className="mt-4" onClick={() => { doLogin() }}>
                                Log in
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>

        </div>
    )
}




