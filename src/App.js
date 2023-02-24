import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import './App.css';

const api_host = "api.untied.io";
//const api_host = "untied1.eu.ngrok.io";

function App() {

  const [accessCode, setAccessCode] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [nino, setNino] = useState('');
  const [dob, setDob] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const saveDetails = () => {
    console.log(email, name, nino, dob);
    setDone(false);
    //post data to https://api.untied.io/tin-verification/save.php
    fetch(`https://${api_host}/tin-verification/save.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accessCode: accessCode,
          email: email,
          name: name,
          nino: nino,
          dob: dob
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            
            setAccessCode('');
            setEmail('');
            setName('');
            setNino('');
            setDob('');
            setError('');
            setDone(true);
          } else {
            setError(data.message);
          }
        }
      )
      .catch((error) => {
        console.error('Error:', error);

      }
    );

  }

  return (
    <div className="App">

      <Container fluid="sm" style={{ maxWidth: 600 }}>

        <Row className="mt-2">
          <img src={require('./ulogo.svg').default} alt="untied logo"/>
        </Row>

        <Row className="pt-4">        

        {done && <Card className="mt-4 mb-4" bg="success" text="light"><Card.Body><Card.Title>Thank you</Card.Title><Card.Text>We have received your details and will send you an email with the results.</Card.Text></Card.Body></Card>}

        {error!=="" && <Card className="mt-4 mb-4" bg="danger" text="light"><Card.Body><Card.Title>Error</Card.Title><Card.Text>{error}</Card.Text></Card.Body></Card>}

          <p>Check a seller's name, national insurance number and date of birth against HMRC records.</p>

        </Row>

        <Row>

          <Form>

          <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Secret access code</Form.Label>
              <Form.Control type="password" placeholder="Enter your secret access code provided by untied" value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value);
                }}
              />

            </Form.Group>


            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Your email address</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <Form.Text className="text-muted">
                This is where we will send the verification results. Your email won't be used for any other purpose.
              </Form.Text>
            </Form.Group>

            <hr />
            <h3>Details of the subject (seller) to be checked</h3>
            

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Full name</Form.Label>
              <Form.Control type="text" placeholder="Enter full name" value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>National Insurance Number (NINO)</Form.Label>
              <Form.Control type="text" placeholder="Enter NINO" value={nino}
                onChange={(e) => {
                  setNino(e.target.value);
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Date of birth</Form.Label>
              <Form.Control type="date" placeholder="Enter DoB" value={dob}
                onChange={(e) => {
                  setDob(e.target.value);
                }}
              />

            </Form.Group>

            <p>
              By pressing submit you confirm the subject has agreed to this check and that you accept the <a href="https://www.untied.io/tvs_terms" target="_new">terms and conditions</a>.
            </p>

            <Button variant="primary" type="submit"
              onClick={(e) => {
                e.preventDefault();
                saveDetails();
              }}
            >
              Submit
            </Button>
          </Form>

        </Row>

        <Row>
          <p className="mt-2">Checks take 2 or 3 minutes. You will receive an email with the results, indicating whether the NINO and DoB match and a percentage match for the name.</p>
        </Row>

      </Container>




    </div>
  );
}

export default App;