import React, { Fragment, useContext, useEffect } from "react";
import Breadcrumb from "../common/breadcrumb/breadcrumb";
import { Container, Row, Col, Card,Table } from "reactstrap";
import { AppContext } from "../../index";
import { actionStatutList as statutLst } from "../../helpers/actionStatutList";
import "./lastTransactions.css"
import { map } from "lodash";
const LastTransaction = (props) => {
  const context = useContext(AppContext);

  useEffect(renderActions, [context.user]);

  function getTransactionPark() {
    if (context?.user?.lastTransactions) {
      const valueIndex = context?.user?.lastTransactions?.findIndex(
        (el) => el.amount !== 0 && el.action === context.actionParked
      );
      if (valueIndex > -1) {        
        let texte =  statutLst.find((st) => st.value === context.actionParked)?.description +
          " et vous avez gagné " +
          context.user.lastTransactions[valueIndex].amount +
          " " +
          context.user.lastTransactions[valueIndex].currency +
          "  le : " +
          new Date(context.user.lastTransactions[valueIndex].createdAt).toLocaleDateString();

          return (
          <Card className="card card-g-secondary card-last-transaction">
            <Container fluid={true}>
              <Row>
                <Col sm="12" xl="12  xl-100">
                  <div>{texte}</div>
                </Col>
              </Row>
            </Container>
          </Card>
          )
      }     
    }
  }

  function getTransactionGiver() {
    if (context?.user?.lastTransactions) {
      const valueIndex = context?.user?.lastTransactions?.findIndex(
        (el) => el.amount !== 0 && el.action === context.actionGiver
      );
      
      if (valueIndex > -1) {
        let texte =  statutLst.find((st) => st.value === context.actionGiver)?.description + 
        " et vous avez gagné " +
        context.user.lastTransactions[valueIndex].amount +
        " " +
        context.user.lastTransactions[valueIndex].currency +
        " le : " +
        new Date(context.user.lastTransactions[valueIndex].createdAt).toLocaleDateString();
       
        return (
          <Card className="card card-g-info card-last-transaction">
            <Container fluid={true}>
              <Row>
                <Col sm="12" xl="12  xl-100">
                  <div>{texte}</div>
                </Col>
              </Row>
            </Container>
          </Card>
        );
      }
    }
  }

  function getTransactionTaker() {
    if (context?.user?.lastTransactions) {
      const valueIndex = context?.user?.lastTransactions?.findIndex(
        (el) => el.amount !== 0 && el.action === context.actionTaker
      );
     
      if (valueIndex > -1) {
        let texte = statutLst.find((st) => st.value === context.actionTaker)?.description + 
        " et vous avez gagné " +
        context.user.lastTransactions[valueIndex].amount +
        " " +
        context.user.lastTransactions[valueIndex].currency +
        " le : " +
        new Date(context.user.lastTransactions[valueIndex].createdAt).toLocaleDateString();

        return (
          <Card className="card card-g-success card-last-transaction">
            <Container fluid={true}>
              <Row>
                <Col sm="12" xl="12  xl-100">
                  <div>{texte}</div>
                </Col>
              </Row>
            </Container>
          </Card>
        );
      }
    }
  }

  function renderOneAction(tr) {
    let colorClass = "card-g-primary";
    if (tr.action === context.actionTaker) {
      colorClass = 'card-g-success'
    } else if (tr.action === context.actionGiver) {
      colorClass = 'card-g-info'
    } else if (tr.action === context.actionParked) {
      colorClass = 'card-g-secondary'
    }
    let texte = statutLst.find((st) => st.value === tr.action)?.description +
      " et vous avez gagné " +
      tr.amount +
      " " +
      tr.currency +
      " le : " +
      new Date(tr.createdAt).toLocaleDateString();
      return (
        <Card className={"card card-last-transaction " + colorClass} >
          <Container fluid={true}>
            <Row>
              <Col sm="12" xl="12  xl-100">
                <div>{texte}</div>
              </Col>
            </Row>
          </Container>
        </Card>
      );
  }
  function renderLastActions() {
    if (context?.user?.lastTransactions) {
      let tab = [];
      context.user.lastTransactions.forEach(transaction => {
        if (transaction.amount !== 0) {
          const actionIndex = tab.findIndex(
            (el) => el.action === transaction.action
          );
          if (actionIndex === -1) {
            tab.push(transaction);
          }
        }
      });
     
      return tab.map((tr)=>renderOneAction(tr));
    }
  }
  function renderActions() {
    if (context.user?.lastTransactions) {
      if (context.user?.lastTransactions.length > 0) {
        let tab = [];
        context.user.lastTransactions.forEach((transact) => {
          let action = transact.action;
          const st = statutLst.find((st) => st.value === transact.action);
          if (st) action = st.description;

          let row = (
            <tr>
              <td className="text-white">{action}</td>
              <td className="text-white">{transact?.location?.info} </td>
              <td className="text-white">
                {new Date(transact.createdAt).toLocaleDateString() +
                  " " +
                  new Date(transact.createdAt).toLocaleTimeString()}
              </td>
              <td className="text-white">
                {transact.amount} {transact.currency}
              </td>
            </tr>
          );
          tab.push(row);
        });       
        return (
          <div style={{ whiteSpace: "pre-line" }}>
            <h3>Vos 10 dernières actions :</h3> <br />
            <Table className="table-responsive table-borderless">
              <tbody>{tab}</tbody>
            </Table>
          </div>
        );
      } else {

        return(
          <div style={{ whiteSpace: "pre-line" }}>
              <h3>Aucune action pour le moment</h3>             
          </div>
        )
      }
    }
  }
  

  return (
    <Fragment>
      <Breadcrumb parent="Default" title="Vos dernières actions qui vous ont apportées des points " />
      {/* {getTransactionPark()}
      {getTransactionGiver()}
      {getTransactionTaker()}       */}
      {renderLastActions()}
      <Card  className="card card-g-primary card-last-transaction">
        <Container fluid={true}>
          <Row>
            <Col sm="12" xl="12  xl-100">
              {renderActions()}
              {/* <div style={{ whiteSpace: "pre-line" }}>
                <h3>Vos 10 dernières actions :</h3> <br />                
                <Table className="table-responsive table-borderless">
                  <tbody>{renderActions()}</tbody>
                </Table>
              </div> */}
            </Col>
          </Row>
        </Container>
      </Card>
    </Fragment>
  );
};

export default LastTransaction;
