
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';


export const DataModal = (props) => {

    const [sortDirections, setSortDirections] = useState({
        employments: { tax_year: 'asc', currentField: 'tax_year' },
        state_pensions: { tax_year: 'asc', currentField: 'tax_year' },
        debts: { tax_year: 'asc', currentField: 'tax_year'},
        allowances: { tax_year: 'asc', currentField: 'tax_year' },
    } )
            

    const handleClose = () => {
        if (props.onClose) {
            props.onClose();
        }
    }

    const sortArray = (arrayName, fieldName) => {

        console.log('sortArray', arrayName, fieldName)

        let currentSortDirection = sortDirections[arrayName][fieldName] || 'asc';

        let newArray = [...props.userData[arrayName]];
        newArray.sort((a, b) => {
            if (a[fieldName] < b[fieldName]) {
                return currentSortDirection === 'asc' ? -1 : 1;
            }
            if (a[fieldName] > b[fieldName]) {
                return currentSortDirection === 'asc' ? 1 : -1;
            }

            return 0;
        });
        let newUserData = { ...props.userData };
        newUserData[arrayName] = newArray;

        //store the new sort direction
        let newSortDirections = {...sortDirections};
        newSortDirections[arrayName][fieldName] = currentSortDirection === 'asc' ? 'desc' : 'asc';
        newSortDirections[arrayName].currentField = fieldName;
        setSortDirections(newSortDirections);

        if (props.updateUserData) {
            props.updateUserData(newUserData);
        }

    }

    const renderSortDirection = (arrayName, fieldName) => {

        if (!sortDirections[arrayName]) {
            return null;
        }
        
        if (sortDirections[arrayName].currentField !== fieldName) {
            return null;
        }

        let currentSortDirection = sortDirections[arrayName][fieldName] || 'asc';

        if (currentSortDirection === 'desc') {
            return <span>&#9650;</span>
        } else {
            return <span>&#9660;</span>
        }
    }

    const exporDataToCsv = (arrayName) => {

    
        console.log('exportDataToCsv', arrayName)
    
        let csvContent = "data:text/csv;charset=utf-8,";
        let csvData = props.userData[arrayName];
        let csvFields = Object.keys(csvData[0]);
       
        // remove 'html', 'id' and 'user_id' values from csvFields array
        csvFields = csvFields.filter((field) => {
            return field !== 'html' && field !== 'id' && field !== 'user_id';
        });

        csvContent += csvFields.join(',') + '\r\n';

        csvData.forEach((item) => {
            let row = [];
            csvFields.forEach((field) => {
                if (field !== 'id' && field !== 'user_id' && field !== 'html') {

                    var val = item[field]

                    if (field === 'allowances' || field === 'deductions' || field === 'benefits') {
                        val = item[field].replaceAll('\\u00a3','£').replaceAll('{','').replaceAll('}','').replaceAll('"','')
                    }

                    if (val !== null) {
                        // remove html from val
                        val = val.replace(/<[^>]+>/g, '');
                        // replace line breaks with spaces
                        val = val.replace(/(\r\n|\n|\r)/gm, " ");
                        // replace multiple spaces with one space
                        val = val.replace(/\s+/g, ' ');
                    }

                    row.push('"' + val + '"');
                }
            });
            csvContent += row.join(',') + '\r\n';
        });
        let encodedUri = encodeURI(csvContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", props.userData.nino + "_" + arrayName + ".csv");
        document.body.appendChild(link); // Required for FF
        link.click();
    }

    const DownloadIcon = (props) => {
        return (
            <img src={require('../icons/download.svg').default} alt="download csv" {...props} title="download to csv"/> 
        )
    }


    return (

        <Modal show={props.show} fullscreen={true} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Income Record Viewer</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h2>Employments <DownloadIcon style={{cursor:'pointer',width:20}} onClick={() => exporDataToCsv('employments')} /></h2> 

                
                <table className="table table-striped" style={{ fontSize: 12 }}>
                    <thead>
                        <tr role='button' style={{whiteSpace:'nowrap'}}>
                            {/* <th scope="col">ID</th> */}
                            <th scope="col" onClick={()=>sortArray('employments','tax_year')}>Tax Year {renderSortDirection('employments','tax_year')}</th>
                            <th scope="col" onClick={()=>sortArray('employments','name')}>Name {renderSortDirection('employments','name')}</th>
                            <th scope="col" onClick={()=>sortArray('employments','start_date')}>Start Date {renderSortDirection('employments','start_date')}</th>
                            <th scope="col" onClick={()=>sortArray('employments','end_date')}>End Date {renderSortDirection('employments','end_date')}</th>
                            <th scope="col" onClick={()=>sortArray('employments','tax_code')}>Tax Code {renderSortDirection('employments','tax_code')}</th>
                            <th scope="col" onClick={()=>sortArray('employments','paye_ref')}>PAYE REF {renderSortDirection('employments','paye_ref')}</th>
                            <th scope="col" onClick={()=>sortArray('employments','type')}>Type {renderSortDirection('employments','type')}</th>
                            <th scope="col" onClick={()=>sortArray('employments','status')}>Status {renderSortDirection('employments','status')}</th>
                            <th scope="col" onClick={()=>sortArray('employments','taxable_income')}>Taxable income {renderSortDirection('employments','taxable_income')}</th>
                            <th scope="col" onClick={()=>sortArray('employments','tax_paid')}>Tax paid {renderSortDirection('employments','tax_paid')}</th>
                            <th scope="col" onClick={()=>sortArray('employments','student_loan_paid')}>Student loan repaid {renderSortDirection('employments','student_loan_paid')}</th>
                            <th scope="col">Allowances</th>
                            <th scope="col">Deductions</th>
                            <th scope="col">Benefits</th>
                            <th scope="col" onClick={()=>sortArray('employments','updated')}>Updated {renderSortDirection('employments','updated')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.userData.employments.map((item, index) => (
                            <tr key={index} onClick={() => {
                                // nothing
                            }} role='button' style={{whiteSpace:'nowrap'}}>
                                {/* <th scope="row">{item.id}</th> */}
                                <td>{item.tax_year}</td>
                                <td>{item.name}</td>
                                <td>{item.start_date}</td>
                                <td>{item.end_date}</td>
                                <td>{item.tax_code}</td>
                                <td>{item.paye_ref}</td>
                                <td>{item.type}</td>
                                <td>{item.status}</td>
                                <td>{item.taxable_income}</td>
                                <td>{item.tax_paid}</td>
                                <td>{item.student_loan_repaid}</td>
                                <td>{item.allowances.replaceAll('\\u00a3','£').replaceAll('{','').replaceAll('}','').replaceAll('"','')}</td>
                                <td>{item.deductions.replaceAll('\\u00a3','£').replaceAll('{','').replaceAll('}','').replaceAll('"','')}</td>
                                <td>{item.benefits.replaceAll('\\u00a3','£').replaceAll('{','').replaceAll('}','').replaceAll('"','')}</td>
                                <td>{item.updated}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>


                <h2>State pensions <DownloadIcon style={{cursor:'pointer',width:20}} onClick={() => exporDataToCsv('state_pensions')} /></h2>

                <table className="table table-striped" style={{ fontSize: 12 }}>
                    <thead>
                        <tr role="button" style={{whiteSpace:'nowrap'}}>
                            {/* <th scope="col">ID</th> */}
                            <th scope="col" onClick={()=>sortArray('state_pensions','tax_year')}>Tax Year {renderSortDirection('state_pensions','tax_year')}</th>
                            <th scope="col" onClick={()=>sortArray('state_pensions','per_week')}>Per week {renderSortDirection('state_pensions','per_week')}</th>
                            <th scope="col" onClick={()=>sortArray('state_pensions','to_date')}>Paid to date {renderSortDirection('state_pensions','to_date')}</th>
                            <th scope="col" onClick={()=>sortArray('state_pensions','year_total')}>Total for year {renderSortDirection('state_pensions','year_total')}</th>
                            <th scope="col" onClick={()=>sortArray('state_pensions','updated')}>Updated {renderSortDirection('state_pensions','updated')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.userData.state_pensions.map((item, index) => (
                            <tr key={index} onClick={() => {
                                // nothing
                            }} role='button'>
                                {/* <th scope="row">{item.id}</th> */}
                                <td>{item.tax_year}</td>
                                <td>{item.per_week}</td>
                                <td>{item.to_date}</td>
                                <td>{item.year_total}</td>
                                <td>{item.updated}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Allowances <DownloadIcon style={{cursor:'pointer',width:20}} onClick={() => exporDataToCsv('allowances')} /></h2>

                <table className="table table-striped" style={{ fontSize: 12 }}>
                    <thead>
                        <tr role="button" style={{whiteSpace:'nowrap'}}>
                            {/* <th scope="col">ID</th> */}
                            <th scope="col" onClick={()=>sortArray('allowances','tax_year')}>Tax Year {renderSortDirection('allowances','tax_year')}</th>
                            <th scope="col" onClick={()=>sortArray('allowances','name')}>Description {renderSortDirection('allowances','name')}</th>
                            <th scope="col" onClick={()=>sortArray('allowances','value')}>Value {renderSortDirection('allowances','value')}</th>
                            <th scope="col" onClick={()=>sortArray('allowances','updated')}>Updated {renderSortDirection('allowances','updated')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.userData.allowances.map((item, index) => (
                            <tr key={index} onClick={() => {
                                // nothing
                            }} role='button'>
                                {/* <th scope="row">{item.id}</th> */}
                                <td>{item.tax_year}</td>
                                <td dangerouslySetInnerHTML={{__html: item.name}} />
                                <td>{item.value}</td>
                                <td>{item.updated}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Debts <DownloadIcon style={{cursor:'pointer',width:20}} onClick={() => exporDataToCsv('debts')} /></h2>

                <table className="table table-striped" style={{ fontSize: 12 }}>
                    <thead>
                        <tr role="button">
                            {/* <th scope="col">ID</th> */}
                            <th scope="col" onClick={()=>sortArray('debts','tax_year')}>Tax Year {renderSortDirection('debts','tax_year')}</th>
                            <th scope="col" onClick={()=>sortArray('debts','name')}>Description {renderSortDirection('debts','name')}</th>
                            <th scope="col" onClick={()=>sortArray('debts','value')}>Value {renderSortDirection('debts','value')}</th>
                            <th scope="col" onClick={()=>sortArray('debts','updated')}>Updated {renderSortDirection('debts','updated')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.userData.debts.map((item, index) => (
                            <tr key={index} onClick={() => {
                                // nothing
                            }} role='button'>
                                {/* <th scope="row">{item.id}</th> */}
                                <td>{item.tax_year}</td>
                                <td dangerouslySetInnerHTML={{__html: item.name}} />
                                <td>{item.value}</td>
                                <td>{item.updated}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </Modal.Body>
        </Modal>
    )

}
