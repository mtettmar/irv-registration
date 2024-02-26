import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { api_host } from './routes';
import Modal from 'react-bootstrap/Modal';
import './App.css';

function Register() {

  const [accessCode, setAccessCode] = useState('');
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [batchRef, setBatchRef] = useState('');
  const [importData, setImportData] = useState('');
  const [arrayData, setArrayData] = useState([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [sendInviteEmails, setSendInviteEmails] = useState(false);

  const saveDetails = () => {
    console.log(email, importData);

    // get token from local storage
    const token = localStorage.getItem('token');

    setDone(false);
    //post data to https://api.untied.io/tin-verification/save.php
    fetch(`https://${api_host}/irv-registration/save.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        token: token
      },
      body: JSON.stringify({
        //accessCode: accessCode,
        email: email,
        batch_ref: batchRef,
        data: importData,
        send_invite_emails: sendInviteEmails ? "Y" : "N"
      })
    }).then((res) => { 

      if (res.status == 401) {
        // log out
        localStorage.removeItem('token');
        window.location.href = '/login';
     
      } else {
        res.json().then(data => {

          // if response code is 401 then log out
          console.log(data)

          if (data.status === 'success') {

            setAccessCode('');
            setImportData('');
            setError('');
            setDone(true);
            getRecords()
          } else {
            setError(data.message);
          }
        })

      }

    })
   

  }


  const getRecords = () => {
    console.log(email, importData);
    //post data to https://api.untied.io/tin-verification/save.php
    fetch(`https://${api_host}/irv-registration/list.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: localStorage.getItem('token')
      }
    })
      .then(res => {
        if (res.status == 401) {
          // log out
          localStorage.removeItem('token');
          window.location.href = '/login';
        } else {
          res.json().then(data => {
            if (data.status === 'success') {
    
              const adata = data.data
              //sort adata by date_processed attribute
              adata.sort(function (a, b) {
                return new Date(b.requested) - new Date(a.requested);
              });
    
              setArrayData(adata);
              console.log(data)
            } else {
              setError(data.message);
            }
          })
        }
      })
      
  }

  return (
    <div className="App">

      <Modal show={showInvite} onHide={() => { setShowInvite(false) }}>
        <Modal.Header closeButton>
          <Modal.Title>Invite link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Copy and share this link with your client</p>

          <p>{inviteUrl}</p>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowInvite(false) }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>



      <Container fluid="sm" style={{ maxWidth: 600 }}>

        <Row className="mt-2">
          <img src={require('./asrlogo.svg').default} alt="untied logo" /> <br />
        </Row>

        <Row className="mb-2">

          {/* <h1>Agent Registration Service</h1> */}
        </Row>

        <Row className="pt-4">


          {done && <Card className="mt-4 mb-4" bg="success" text="light"><Card.Body><Card.Title>Thank you</Card.Title><Card.Text>Your data has been imported and will be processed in the next few minutes.</Card.Text></Card.Body></Card>}

          {error !== "" && <Card className="mt-4 mb-4" bg="danger" text="light"><Card.Body><Card.Title>Error</Card.Title><Card.Text>{error}</Card.Text></Card.Body></Card>}


        </Row>

        <Row>

          <Form>

            {/* <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Secret access code</Form.Label>
              <Form.Control type="password" placeholder="Enter your secret access code provided by untied" value={accessCode}
                onChange={(e) => {
                  setAccessCode(e.target.value);
                }}
              />

            </Form.Group> */}

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

            {/* <hr /> */}
            {/* <h3>Import</h3> */}

            {/* add a file upload button here and put the contents in the textarea below */}
              

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Upload CSV file or paste below</Form.Label>
              <Form.Control type="file" placeholder="Upload CSV file" 
                onChange={(e) => {
                  // get content of imported file
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.readAsText(file);
                  reader.onload = () => {
                    const text = (reader.result);
                    setImportData(text);
                  }
                }}
              />
            </Form.Group>



            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Import client records</Form.Label>
              <Form.Control as="textarea" rows={6} type="text" placeholder="NX112233A,1980-11-15,CLIENT@EMAIL.XYZ,OPTIONAL_REFERENCE" value={importData}
                onChange={(e) => {
                  setImportData(e.target.value);
                }}
              />
            </Form.Group>

            <p>
              Import format: NINO,DOB,EMAIL,OPTIONAL_REFERENCE. 
            </p>
            <p>
              If using Excel all columns should be formatted as text and DoB should be in YYYY-MM-DD format. Format the column before entering the date to prevent Excel from reformatting it. Then save as CSV. <a href="/star_import_template.xlsx">Download a pre-formatted template with instructions</a>.
            </p>


            <Form.Group className="mt-4">
                <Form.Check type="checkbox" label={<p>Send invite emails to customers - make sure email template etc is set up in <a href="/settings" >settings</a></p>} checked={sendInviteEmails}

                    onChange={(e) => { setSendInviteEmails(e.target.checked) }}
                />
            </Form.Group>


            <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
              <Form.Label>Email address to send results to</Form.Label>
              <Form.Control type="email" placeholder="Enter your email" value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <Form.Text className="text-muted">
                This is where we will send the results of the import. 
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Batch reference (optional)</Form.Label>
              <Form.Control type="text" placeholder="Batch reference" value={batchRef}
                onChange={(e) => {
                  setBatchRef(e.target.value);
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

        </Container>
        <Container fluid="sm" style={{ width:'90%' }}>

        {/* <Row>
          <p className="mt-2">Checks take 2 or 3 minutes. You will receive an email with the results, indicating whether the NINO and DoB match and a percentage match for the name.</p>
        </Row> */}

        {arrayData.length > 0 && <Row className="mt-4">
          <h3>Invitations</h3>
          <table className="table table-striped" style={{ fontSize: 12 }}>
            <thead>
              <tr>
                {/* <th scope="col">ID</th> */}
                <th scope="col">NINO</th>
                <th scope="col">DoB</th>
                <th scope="col">Email</th>
                <th scope="col">Processed</th>
                <th scope="col">Processed Date</th>
                <th scope="col">Reference</th>
                <th scope="col">Batch</th>
              </tr>
            </thead>
            <tbody>
              {arrayData.map((item, index) => (
                <tr key={index} onClick={() => {
                  if (item.invite_url) {
                    setInviteUrl(item.invite_url);
                    setShowInvite(true);
                  }
                }} role='button'>
                  {/* <th scope="row">{item.id}</th> */}
                  <td>{item.nino}</td>
                  <td>{item.dob}</td>
                  <td>{item.email}</td>
                  <td>{item.processed=='Y'?'Yes':'No'}</td>
                  <td>{item.date_processed}</td>
                  <td>{item.custom_ref}</td>
                  <td>{item.batch_ref}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Row>}

        <div style={{height:100}} />


      </Container>




    </div>
  );
}

export default Register;