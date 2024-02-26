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
import { SimpleConfirm } from './dialogs/confirm';
import { DataModal } from './dialogs/dataModal';


import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


// create a login component
export default function Dashboard() {

  const [rowData, setRowData] = useState([]);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryHtml, setSummaryHtml] = useState('');
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [showDelButton, setShowDelButton] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] =   useState(false);
  const [userData, setUserData] = useState({
    employments: [],
    state_pensions: [],
    debts: [],
    allowances: [],
  })

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

    {  maxWidth: 40,
      filter: false,
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      lockPosition: true,
      sortable: false,
      resizable: false,
      cellClass: "cell-style" },

    { field: 'nino', filter: true, width: 150, floatingFilter: true },
    { field: 'dob', filter: true, width: 150, floatingFilter: true },
    { field: 'email', filter: true, width: 250, floatingFilter: true },
    { field: 'name', filter: true, width: 250, floatingFilter: true },
    {
      field: 'registered', headerName: 'Status', filter: true, width: 150, floatingFilter: true,

      
      cellRenderer: (params) => {
        if (params.value === "Y") {
          return "Accepted";
        }
        if (params.value === "C") {
          return "Cancelled"
        }
        return "Pending";
      },

      cellStyle: (params) => {
        if (params.value === "Y") {
          return {
            color: "white",
            backgroundColor: "#00B050",
            fontWeight: "bold",
            textAlign: "center"
          }        
        }
        if (params.value === "N") {
          return {
            color: "black",
            backgroundColor: "#FFC000",
            fontWeight: "bold",
            textAlign: "center"
          }
        }
        if (params.value === "C") {
          return {
            color: "black",
            backgroundColor: "red",
            fontWeight: "bold",
            textAlign: "center"
          }
        }

      }
    },
    { field: 'reference', headerName: 'Reference', filter: true, width: 200, floatingFilter: true },
    { field: 'last_updated', headerName: 'Last updated', filter: true, width: 200, floatingFilter: true },
    // { headerName: 'Update', cellRenderer: (params) => {
    //   return <button class="btn btn-primary btn-sm" onClick={()=>updateClient(params.data.id)}>Update</button>
    // }, filter: false, width: 100, floatingFilter: false}
  ])

  const updateClient = (id) => {
    
  }

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

    const id = row.data.id;
    //fetch userDate - getUserData.php?id=id
    fetch(`https://${api_host}/irv-registration/getUserData.php?id=${id}`, {
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

              console.log(data);

              setUserData({nino: row.data.nino, employments: data.employments, state_pensions: data.state_pensions, debts: data.debts, allowances: data.allowances});
              setShowSummary(true);
              
            }
         })
        }
      })

      

    // do we have summary data?
    // if (row.data.summary) {
    //   //summary data is the html, create a popup showing that html
    //   setSummaryHtml(row.data.summary);
    //   setShowSummary(true);
    // }
  }

  const onSelectionChanged = () => {
    const selectedGridRows = gridApi.getSelectedRows();
    let rowCount = gridApi.getSelectedRows().length;    
    setShowDelButton(rowCount>0)
  }

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  }

  const deleteSelected = () => {
  
    const selectedGridRows = gridApi.getSelectedRows();

    let rowCount = gridApi.getSelectedRows().length;

    if (rowCount > 0) {

      // get an array of just the IDs
      const selectedIds = selectedGridRows.map((row) => {
        return row.id;
      });

      setShowConfirmDelete(false)
      setShowDelButton(false)

      //delete the selected rows
      //post data to https://api.untied.io/tin-verification/save.php
      fetch(`https://${api_host}/irv-registration/delete.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: localStorage.getItem('token')
        },
        body: JSON.stringify({ids: selectedIds})
      })
        .then(res => {
          if (res.status == 401) {
            // log out
            localStorage.removeItem('token');
            window.location.href = '/login';
          } else {
            res.json().then(data => {
              if (data.status === 'success') {
                //refresh the grid
                getRecords();
              } else {
                setError(data.message);
              }
            })
          }
        })
    }
  }


  return (
    <div>

      <DataModal 
        show={showSummary}
        onClose={() => setShowSummary(false)}
        userData={userData}
        updateUserData={setUserData}
      />

      <SimpleConfirm 
        show={showConfirmDelete}
        heading="Delete selected records?"
        body="Are you sure you want to delete the selected records?"
        onConfirm={() => deleteSelected()}
        onClose={() => setShowConfirmDelete(false)}
      ></SimpleConfirm>

      <Container fluid="sm" style={{ width: '90%' }}>

        <Row className="mt-2 mx-auto" style={{ maxWidth: 600 }}>
          <img src={require('./asrlogo.svg').default} alt="untied logo" /> <br />
        </Row>

        <Row className="mt-4">

          <div className="d-flex">

            {showDelButton && <button className="me-2 mb-2 rounded" id="clientDelButton" onClick={()=>setShowConfirmDelete(true)}>Delete</button>}

            <h3>Clients</h3>
     
            <span className="ms-auto my-2">Double click a record to view snapshot</span>
          </div>

          <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              onRowDoubleClicked={row => handleRowClick(row)}
              enableCellTextSelection={true}
              onGridReady={onGridReady}
              onSelectionChanged={onSelectionChanged}
            > </AgGridReact>
          </div>

        </Row>
      </Container>

    </div>
  )
}




