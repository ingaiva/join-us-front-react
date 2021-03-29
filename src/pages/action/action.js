import React, { Fragment } from "react";
import Breadcrumb from "../../component/common/breadcrumb/breadcrumb";
import { Container, Row, Col, Card } from "reactstrap";
import ActionTab from "../../component/actionTab/actionTab";

const Action = (props) => {
  return (
    <Fragment>
      <Breadcrumb parent="Starter kit" title="Vos actions" />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
              <ActionTab />
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Action;
