import { useContext } from "react";
import React, { Fragment } from "react";
import Breadcrumb from "../common/breadcrumb/breadcrumb";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { AppContext } from "../../index";

function Solde() {
  const context = useContext(AppContext);

  function XRP() {
    if (context?.user?.solde) {
      const currencyIndex = context?.user?.solde?.findIndex(
        (el) => el.currency === "XRP"
      );
      if (currencyIndex != -1) {
        return context.user.solde[currencyIndex].solde;
      } else return "0";
    }
  }

  function EUR() {
    if (context?.user?.solde) {
      const currencyIndex = context?.user?.solde?.findIndex(
        (el) => el.currency === "EUR"
      );
      if (currencyIndex != -1) {       
        return context.user.solde[currencyIndex].solde;
      } else return "0";
    }
  }

  function RP() {
    if (context?.user?.solde) {
      const currencyIndex = context?.user?.solde?.findIndex(
        (el) => el.currency === "RP"
      );
      if (currencyIndex != -1) {
        return context.user.solde[currencyIndex].solde;
      } else return "0";
    }
  }

  return (
    <Fragment>
      <Breadcrumb parent="Default" title="Vos points" />
       <Card
        className="card card-g-secondary"
        style={{  marginLeft: "10%", marginRight: "10%", }}>
        <CardBody style={{  padding: "2%", }}>
          <Container fluid={true}>
            <Row>
              <Col sm="12" xl="12  xl-100">
                <p>
                  <span
                    style={{  fontSize: 20, fontWeight: 800,  }} >
                    {EUR()} EUR 
                  </span>                  
                </p>
              </Col>
            </Row>
          </Container>
        </CardBody>
      </Card>
      <Card
        className="card card-g-success"
        style={{
          marginLeft: "10%",
          marginRight: "10%",
        }}
      >
        <CardBody
          style={{
            padding: "2%",
          }}
        >
          <Container fluid={true}>
            <Row>
              <Col sm="12" xl="12  xl-100">
                <p>
                  <span style={{ fontSize: 20, fontWeight: 800, }}>
                    {XRP()} XRP 
                  </span>                  
                </p>
              </Col>
            </Row>
          </Container>
        </CardBody>
      </Card>

     
      <Card
        className="card card-g-info"
        style={{
          marginLeft: "10%",
          marginRight: "10%",
        }}
      >
        <CardBody
          style={{
            padding: "2%",
          }}
        >
          <Container fluid={true}>
            <Row>
              <Col sm="12" xl="12  xl-100">
                <p>
                  <span  style={{fontSize: 20,  fontWeight: 800, }} >
                    {RP()} RP 
                  </span>                 
                </p>
              </Col>
            </Row>
          </Container>
        </CardBody>
      </Card>
    </Fragment>
  );
}

export default Solde;
