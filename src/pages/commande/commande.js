import React, { Fragment } from "react";
import Breadcrumb from "../../component/common/breadcrumb/breadcrumb";
import { Container, Row, Col, Card } from "reactstrap";
import OrderTab from "../../component/orderTab/OrderTab";
const Commande = (props) => {
  return (
    <Fragment>
      <Breadcrumb parent="Starter kit" title="Vos commandes" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <OrderTab />
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Commande;
