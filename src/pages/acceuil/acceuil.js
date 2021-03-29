import React, { Fragment, useContext } from "react";
import { Container, Row, Col, Card } from "reactstrap";
import Apexcharts from "../../component/stats/apexcharts";
import Solde from "../../component/solde/solde";
import LastTransaction from "../../component/lastTransactions/lastTransaction";
import Catalogue from "../../component/catalogue/catalogue";
import AdminPage from "../../pages/pageAdmin/pageAdmin";
import { AppContext } from "../../index";

//Dashboard Proncipal//
const Acceuil = (props) => {
  const context = useContext(AppContext);
  function renderIfAdmin() {
    if (context.isAdmin()) {
      return <AdminPage />;
    }
  }
  function renderUser() {
    if (context.user){

      if (context.isAdmin() && !context.isUser()) {
        return (
          <Container fluid={true}>
            {renderIfAdmin()}
            <Row>
              <Col sm="12">
                <Card>
                  <Catalogue />
                </Card>
              </Col>
            </Row>
          </Container>
        );
      } else {
        return (
          <Container fluid={true}>
            <Row>
              <Col sm="12">
                <Card style={{ marginTop: 20 }}>
                  <Apexcharts />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <Card>
                  <Solde />
                </Card>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <Card>
                  <LastTransaction />
                </Card>
              </Col>
            </Row>
            {renderIfAdmin()}
            <Row>
              <Col sm="12">
                <Card>
                  <Catalogue />
                </Card>
              </Col>
            </Row>
          </Container>
        );
      }
    }
  }

  return (
    <Fragment>
      {renderUser()}     
    </Fragment>
  );
};

export default Acceuil;
