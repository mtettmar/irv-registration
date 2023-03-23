import React from "react";
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { api_host } from './routes';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

// create a login component
export default function Dashboard() {

  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryHtml, setSummaryHtml] = useState('');

  const defaultColDef = {
    resizable: true,
    editable: false,
    sortable: true,
    filter: true,
    floatingFilter: true,
    suppressMenu: true,
    flex: 1,
    minWidth: 120
};


  const [columnDefs] = useState([
    { field: 'nino', filter: true, width: 150, floatingFilter: true },
    { field: 'dob', filter: true, width: 150, floatingFilter: true },
    { field: 'email', filter: true, width: 250, floatingFilter: true },
    { field: 'name', filter: true, width: 250, floatingFilter: true },
    {
      field: 'registered', headerName: 'Accepted', filter: true, width: 150, floatingFilter: true,

      
      cellRenderer: (params) => {
        if (params.value === "Y") {
          return "Yes";
        } else {
          return "No";
        }
      },

      cellStyle: (params) => {
        if (params.value === "Y") {
          return {
            color: "white",
            backgroundColor: "#00B050",
            fontWeight: "bold",
            textAlign: "center"
          };
        } else {
          return {
            color: "black",
            backgroundColor: "#FFC000",
            fontWeight: "bold",
            textAlign: "center"
          }
        }
      }
    },
    { field: 'reference', headerName: 'Reference', filter: true, width: 200, floatingFilter: true },
    { field: 'last_updated', headerName: 'Last updated', filter: true, width: 200, floatingFilter: true },
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
                return new Date(b.last_updated) - new Date(a.last_updated);
              });

              setRowData(adata);

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

  const handleRowClick = (row) => {
    console.log(row.data);
    // do we have summary data?
    if (row.data.summary) {
      //summary data is the html, create a popup showing that html
      setSummaryHtml(row.data.summary);
      setShowSummary(true);
    }
  }

  return (
    <div>

      <Modal show={showSummary} fullscreen={true} onHide={() => setShowSummary(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Snapshot</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{__html: summaryHtml}} />
        </Modal.Body>
      </Modal>

      <Container fluid="sm" style={{ width: '90%' }}>

        <Row className="mt-2 mx-auto" style={{ maxWidth: 600 }}>
          <img src={require('./asrlogo.svg').default} alt="untied logo" /> <br />
        </Row>

        <Row className="mt-4">

          <div className="d-flex">
          <h3>Clients</h3>
          <span className="ms-auto my-2">Double click a record to view snapshot</span>
          </div>

          <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onRowDoubleClicked={row => handleRowClick(row)}
              enableCellTextSelection={true}>
            </AgGridReact>
          </div>

        </Row>
      </Container>

    </div>
  )
}




