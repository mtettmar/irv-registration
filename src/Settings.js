import React from "react";
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { api_host } from './routes';

// create a login component
export default function Settings() {
    const [hmrc_username, setUsername] = useState('');
    const [hmrc_password, setPassword] = useState('');
    const [sendInviteEmails, setSendInviteEmails] = useState(false);
    const [inviteEmailTemplate, setInviteEmailTemplate] = useState('');
    const [done, setDone] = useState(false);

    const saveCredentials = () => {

        const payload = {
            "hmrc_agent_services_username": hmrc_username,
            "hmrc_agent_services_password": hmrc_password,
            "send_invite_email": sendInviteEmails === true ? "Y" : "N",
            "invite_email_template": inviteEmailTemplate
        }
        fetch(`https://${api_host}/irv-registration/saveCredentials.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify(payload)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.status === 'success') {
                    console.log(data);
                    setDone(true)

                } else {

                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            })
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        // fetch getCredentials.php
        fetch(`https://${api_host}/irv-registration/getCredentials.php`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                token: token
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log(data.data);
                    setUsername(data.data.hmrc_agent_services_username);
                    setPassword(data.data.hmrc_agent_services_password);
                    setSendInviteEmails(data.data.send_invite_email == "Y");
                    setInviteEmailTemplate(data.data.invite_email_template);

                } else {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            });
    }, []);


    return (
        <div>

            <Container fluid="sm" style={{ maxWidth: 600 }}>

                <Row className="mt-2">
                    <img src={require('./asrlogo.svg').default} alt="untied logo" /> <br />
                </Row>

                <Row className="mt-4">
                    <h3>Settings</h3>

                    {done && <Card className="mt-4 mb-4" bg="success" text="light"><Card.Body><Card.Title>Thank you</Card.Title><Card.Text>Your HMRC credentials have been updated.</Card.Text></Card.Body></Card>}

                </Row>

                <Row className="mt-4">
                    <Col>
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>HMRC Agent Services Username</Form.Label>
                                <Form.Control type="text" placeholder="HMRC username" value={hmrc_username} onChange={(
                                    e) => {
                                    setUsername(e.target.value);
                                }} />

                            </Form.Group>

                            <Form.Group controlId="formBasicPassword" className="mt-4">
                                <Form.Label>HMRC Agent Services Password</Form.Label>
                                <Form.Control type="password" placeholder="HMRC password" value={hmrc_password} onChange={(e) => { setPassword(e.target.value) }} />
                            </Form.Group>


                            <Form.Group className="mt-4">
                                <Form.Check type="checkbox" label="Send invite emails to customers" checked={sendInviteEmails}

                                    onChange={(e) => { setSendInviteEmails(e.target.checked) }}
                                />
                            </Form.Group>

                            <Form.Group className="mt-4" controlId="formBasicEmail">
                                <Form.Label>Invite email template</Form.Label>
                                <Form.Control as="textarea" rows={6} type="text" value={inviteEmailTemplate}
                                    onChange={(e) => {
                                        setInviteEmailTemplate(e.target.value);
                                    }}
                                />
                            </Form.Group>

                            <p>Emails are currently sent from star@untied.io - you may prefer to send directly until this can be customised.</p>
                            
                            <Button variant="primary" className="mt-4" onClick={() => { saveCredentials() }}>
                                Save
                            </Button>


                        </Form>
                    </Col>
                </Row>



            </Container>

        </div>
    )
}




