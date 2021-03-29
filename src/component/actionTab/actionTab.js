// User Interface...
import React from "react";
import { useState, useEffect } from "react";
import { Row, Col, Card, CardHeader, Table } from "reactstrap";
import "./actionTab.css";
import { actionStatutList as statutLst } from "../../helpers/actionStatutList";
import authHeader from "../../auth-header";
function ActionTab() {
  // Variable d'état //
  const [transaction, setTransaction] = useState([]);
  // Lors du premier affichage //
  useEffect(getTransacations, []);
  // Récupèration des transactions //
  async function getTransacations() {
    const options = {
      method: "GET",
      headers: authHeader(),
    };

    let url = process.env.REACT_APP_REWARDS_BACK_HOST + "/user/transactions";
    const response = await fetch(url, options);
    const tansactionData = await response.json();

    setTransaction(tansactionData.transactions);
  }

  function renderActions() {
    if (transaction) {
      const longueur = transaction.length;
      let tab = [];
      for (let i = 0; i < longueur; i++) {
        let action = transaction[i].action;
        let textColor="#1b3155"
        const st = statutLst.find((st) => st.value === transaction[i].action);
        if (st){
           action = st.description;
           textColor=st.textcolor;
        }
         
        let row = (
          <tr>
            <td >
              <div className="rounded-pill d-inline-block py-1 px-2" style={{backgroundColor:textColor, color:'white',fontWeight: 'bold'}}>{action}</div>
            </td>
            <td>
              {transaction[i].amount} {transaction[i].currency}
            </td>
            <td>
              <div>
                {new Date(transaction[i].createdAt).toLocaleDateString() +
                  " " +
                  new Date(transaction[i].createdAt).toLocaleTimeString()}
              </div>
              {transaction[i]?.location?.info }
            </td>
          </tr>
        );
        tab.push(row);
      }
      return tab;
    }
  }

  return (
    <Row>
      <Col sm="12">
        <Card>
          <CardHeader>
            {/* <h3>Historique des actions</h3> */}
            <span>
              Liste de vos dernières actions effectuées avec votre {process.env.REACT_APP_TITLE_MOBILE_APP}
            </span>
          </CardHeader>
          <div className="card-block row">
            <Col sm="12" lg="12" xl="12">
              <div className="table-responsive">
                <Table>
                  <thead className="lights">
                    <tr>
                      <th scope="col">Vos actions</th>
                      <th scope="col">Gains générés</th>
                      <th scope="col">Date</th>
                    </tr>
                  </thead>
                  <tbody>{renderActions()}</tbody>
                </Table>
              </div>
            </Col>
          </div>
        </Card>
      </Col>
    </Row>
  );
}
export default ActionTab;
