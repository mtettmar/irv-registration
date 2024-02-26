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
    const [fromAddress, setFromAddress] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [current_password, setCurrentPassword] = useState('');
    const [new_password, setNewPassword] = useState('');
    const [confirm_new_password, setConfirmNewPassword] = useState('');
    const [apiKeys, setApiKeys] = useState([]);

    const saveCredentials = () => {
        
        var changingPassword = false;

        // if current_password is not empty, then we are changing password
        if (current_password !== '') {
            if (new_password !== confirm_new_password) {
                alert('New passwords do not match');
                return;
            }

            if (new_password.length < 8) {
                alert('New password must be at least 8 characters');
                return;
            }

            if (new_password === current_password) {
                alert('New password cannot be the same as the current password');
                return;
            }

            // make sure new password has at least one number and one letter and one special character
            if (!new_password.match(/^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])([a-zA-Z0-9!@#$%^&*]+)$/)) {
                alert('New password must contain at least one number, one letter and one special character');
                return;
            }

            changingPassword = true;

        }


        const payload = {
            "hmrc_agent_services_username": hmrc_username,
            "hmrc_agent_services_password": hmrc_password,
            "send_invite_email": sendInviteEmails === true ? "Y" : "N",
            "invite_email_template": inviteEmailTemplate,
            "from_email": fromAddress,
            "email_subject": emailSubject,
            "current_password": current_password,
            "new_password": new_password,
            "confirm_new_password": confirm_new_password,
            "changing_password": changingPassword,
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

                    if (changingPassword) {
                        alert('Settings updated and password changed successfully. Please log in again.');
                        setTimeout(() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }, 2000);
                    }

                } else {

                    if (data.message) {
                        alert(data.message);   
                    } else {
                        localStorage.removeItem('token');
                        window.location.href = '/login';
                    }
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
                    setEmailSubject(data.data.email_subject);
                    setFromAddress(data.data.from_email);
                    setApiKeys(data.api_keys);

                } else {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            });
    }, []);

    const revokeApiKey = (apiKey) => {
        const payload = {
            "apiKey": apiKey
        }
        fetch(`https://${api_host}/irv-registration/revokeApiKey.php`, {
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
                    alert('API key revoked');
                    setApiKeys(data.api_keys);
                } else {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }
            })            
    }

    const createApiKey = () => {
        fetch(`https://${api_host}/irv-registration/createApiKey.php`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                if (data.status === 'success') {
                    setApiKeys(data.api_keys);
                } else {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
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

                            <h4 className="mt-4">Email invite setup</h4>


                            <Form.Group controlId="formBasicPassword" className="mt-2">
                                <Form.Label>Send email from:</Form.Label>
                                <Form.Control type="text" placeholder="From address" value={fromAddress} onChange={(e) => { setFromAddress(e.target.value) }} />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword" className="mt-4">
                                <Form.Label>Invite email subject</Form.Label>
                                <Form.Control type="text" placeholder="Subject" value={emailSubject} onChange={(e) => { setEmailSubject(e.target.value) }} />
                            </Form.Group>

                            <Form.Group className="mt-4" controlId="formBasicEmail">
                                <Form.Label>Invite email template</Form.Label>
                                <Form.Control as="textarea" rows={12} type="text" value={inviteEmailTemplate}
                                    onChange={(e) => {
                                        setInviteEmailTemplate(e.target.value);
                                    }}
                                />
                            </Form.Group>

                            <p>Please make sure the domain you are sending from is whitelisted. Contact untied to set that up.</p>

                            <p onClick={() => {
                                var x = document.getElementById("chnagePasswordBlock");
                                if (x.style.display === "none") {
                                    x.style.display = "block";
                                } else {
                                    x.style.display = "none";
                                }  
                            }} style={{color: "var(--bs-link-color)",
                                textDecorationLine: "underline",
                                cursor: "pointer"}}
                            >Change password?</p>

                            <div id="chnagePasswordBlock" style={{display: 'none'}}>
                                <Form.Group controlId="formBasicPassword" className="mt-4">
                                    <Form.Label>Current password:</Form.Label>
                                    <Form.Control type="password" placeholder="Current password" value={current_password} onChange={(e) => { setCurrentPassword(e.target.value) }} />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword" className="mt-4">
                                    <Form.Label>New password:</Form.Label>
                                    <Form.Control type="password" placeholder="New password" value={new_password} onChange={(e) => { setNewPassword(e.target.value) }} />
                                </Form.Group>

                                <Form.Group controlId="formBasicPassword" className="mt-4">
                                    <Form.Label>Confirm new password:</Form.Label>
                                    <Form.Control type="password" placeholder="Confirm New password" value={confirm_new_password} onChange={(e) => { setConfirmNewPassword(e.target.value) }} />
                                </Form.Group>
                            </div>
                            
                            <Button variant="primary" className="mt-4 mb-4" onClick={() => { saveCredentials() }}>
                                Save
                            </Button>


                        </Form>
                    </Col>
                </Row>

            
                <Row className="mt-2 mb-4">
                    <h3>API Keys</h3>
                    <p><span role="button" className="text-decoration-underline" onClick={()=>createApiKey()}>Create new key</span></p>
                    <p>These are the API keys you can use to integrate with the <a href="https://star-client-api.untied.io/docs" target="_new">untied star client api</a></p>
                    {apiKeys && apiKeys.map((apiKey, index) => {
                        return (
                            <div key={index}>
                                <p><b>API Key:</b> {apiKey.api_key} <span onClick={()=> window.navigator.clipboard.writeText(apiKey.api_key)} role="button" className="text-decoration-underline">copy</span> <span onClick={()=>revokeApiKey(apiKey.api_key)} role="button" className="text-decoration-underline">revoke</span></p>
                            </div>
                        ) 
                    })}

                    <p>API keys are unique to your account, should be kept secret and can be revoked at any time.</p>

                </Row>
            


            </Container>

        </div>
    )
}




