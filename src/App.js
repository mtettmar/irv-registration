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
  const [importData, setImportData] = useState('');
  const [arrayData, setArrayData] = useState([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const saveDetails = () => {
    console.log(email, importData);
    setDone(false);
    //post data to https://api.untied.io/tin-verification/save.php
    fetch(`https://${api_host}/irv-registration/save.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accessCode: accessCode,
          email: email,
          data: importData
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {
            
            setAccessCode('');
            setImportData('');
            setError('');
            setDone(true);
            getRecords()
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


  const getRecords = () => {
    console.log(email, importData);
    setDone(false);
    //post data to https://api.untied.io/tin-verification/save.php
    fetch(`https://${api_host}/irv-registration/list.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accessCode: accessCode,
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'success') {

            const adata = data.data
            //sort adata by date_processed attribute
            adata.sort(function(a, b) {
              return new Date(b.requested) - new Date(a.requested);
            });
            
            setArrayData(adata);
            console.log(data)
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
          <img src={require('./asrlogo.svg').default} alt="untied logo"/> <br />      
        </Row>

        <Row className="mb-2">

        {/* <h1>Agent Registration Service</h1> */}
        </Row>

        <Row className="pt-4">        


        {done && <Card className="mt-4 mb-4" bg="success" text="light"><Card.Body><Card.Title>Thank you</Card.Title><Card.Text>Your data has been imported and will be processed in the next few minutes.</Card.Text></Card.Body></Card>}

        {error!=="" && <Card className="mt-4 mb-4" bg="danger" text="light"><Card.Body><Card.Title>Error</Card.Title><Card.Text>{error}</Card.Text></Card.Body></Card>}

         
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

{/* 
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
            </Form.Group> */}

            <hr />
            <h3>Import</h3>
            

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Import client records</Form.Label>
              <Form.Control as="textarea" rows={6} type="text" placeholder="NX112233A,1980-11-15,CLIENT@EMAIL.XYZ" value={importData}
                onChange={(e) => {
                  setImportData(e.target.value);
                }}
              />
            </Form.Group>

            <p>
              By pressing submit you confirm that you accept the <a href="https://www.untied.io/tvs_terms" target="_new">terms and conditions</a>.
            </p>

            <Button variant="primary" type="submit"
              onClick={(e) => {
                e.preventDefault();
                saveDetails();
              }}
            >
              Submit
            </Button>

            <Button variant="primary" type="submit"
              onClick={(e) => {
                e.preventDefault();
                getRecords();
              }}
              className="ms-2"
            >
              Just view records
            </Button>

          </Form>

        </Row>

        {/* <Row>
          <p className="mt-2">Checks take 2 or 3 minutes. You will receive an email with the results, indicating whether the NINO and DoB match and a percentage match for the name.</p>
        </Row> */}
        
        {arrayData.length>0 && <Row className="mt-4">
          <h3>Records</h3>
          <table className="table table-striped" style={{fontSize:12}}>
            <thead>
              <tr>
                {/* <th scope="col">ID</th> */}
                <th scope="col">NINO</th>
                <th scope="col">DoB</th>
                <th scope="col">Email</th>
                <th scope="col">Processed</th>
                <th scope="col">Processed Date</th>
                </tr>
                </thead>
                <tbody>
                  {arrayData.map((item, index) => (
                    <tr key={index}>
                      {/* <th scope="row">{item.id}</th> */}
                      <td>{item.nino}</td>
                      <td>{item.dob}</td>
                      <td>{item.email}</td>
                      <td>{item.processed}</td>
                      <td>{item.date_processed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
        </Row>}
        

      </Container>




    </div>
  );
}

export default App;