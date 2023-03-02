import React from "react";
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { api_host } from './routes';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// create a login component
export default function Dashboard() {
  
    const [rowData, setRowData] = useState([]);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const [columnDefs] = useState([
        { field: 'nino', filter: true, width:150, floatingFilter: true },
        { field: 'dob', filter: true, width:150, floatingFilter: true },
        { field: 'email' , filter: true, width:150, floatingFilter: true},
        { field: 'name', filter: true, width:200, floatingFilter: true },
        { field: 'registered', headerName:'Accepted', filter: true, width:150, floatingFilter: true },
    ])

    const getRecords = () => {

        setDone(false);
        //post data to https://api.untied.io/tin-verification/save.php
        fetch(`https://${api_host}/irv-registration/list.php?processed_only=1`, {
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
        
                  setRowData(adata);
                  console.log(data)
                } else {
                  setError(data.message);
                }
              })
            }
          })
          
      }

    useEffect(() => {
        getRecords();
    }, []);

    return (
        <div>

            <Container fluid="sm" style={{ maxWidth: 900 }}>

                <Row className="mt-2 mx-auto"  style={{maxWidth:600}}>
                    <img src={require('./asrlogo.svg').default} alt="untied logo"/> <br />
                </Row>

                <Row className="mt-4">

                    <h3>Clients</h3>

                <div className="ag-theme-alpine" style={{height: 400, width: 900}}>
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={columnDefs}>
                    </AgGridReact>
                </div>

                </Row>
            </Container>

        </div>
    )
}




