import React, { Fragment } from "react";
import { Container, Row, Col, Card } from "reactstrap";
import CreateOffer from "../../component/createOffer/createOffer";
import OrderList from "../../component/orderList/orderList";
//Dashboard Proncipal//
const PageAdmin = (props) => {
  return (    
      <Row>
        <Col sm="12">
          <OrderList />
          <CreateOffer />
        </Col>
      </Row>    
  );
};

export default PageAdmin;
