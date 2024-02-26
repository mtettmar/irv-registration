import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export const SimpleConfirm = (props)=> {

  const handleClose = () => {
    if (props.onClose) {
         props.onClose();
    }
  } 
  
  const handleConfirm = () => {
    if (props.onConfirm) {
        props.onConfirm();
    }
  }
  
  return (

      <Modal show={props.show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{props.heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{props.body}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

  );
}