import React from "react";
import { useState, useEffect } from "react";
import { Row, Col, Card, CardHeader, Table } from "reactstrap";

import authHeader from "../../auth-header";
import "./Order.css";
import { orderStatutList as statutLst } from "../../helpers/orderStatutList";
function OrderTab() {
  // Variable d'état //
  const [order, setOrder] = useState([]);
  // Lors du premier affichage //
  useEffect(getOrders, []);
  // Récupèration des transactions //
  async function getOrders() {
    const options = {
      method: "GET",
      headers: authHeader(),
    };

    let url = process.env.REACT_APP_REWARDS_BACK_HOST + "/user/cmd"; 
    const response = await fetch(url, options);    
    const orderData = await response.json();   

    setOrder(orderData.orders); // Il y aura surement un point quelque chose
  }

  function renderStatut(order){
    if(order){     
      const st = statutLst.find((st) => st.value === order.statut);
      if (st) {
        return(<div className={`rounded-pill d-inline-block p-1`} style={{backgroundColor : st.color, color : st.textcolor}}>{st.txt}</div>)
        
      }
      else return order.statut;     
    }
  }

  function renderAdress(order){
    if(order){
      let retVal="";
      if(order.address) retVal +=order.address;
      if(order.address2){
        if(retVal.length>0 ) retVal+="\n ";
        retVal+=order.address2;
      }
      if(order.cp || order.ville){
        if(retVal.length > 0 ) retVal+="\n ";
        if(order.cp) retVal+=order.cp;
        retVal+=order.ville ? ' '+ order.ville : '';      
      }
      return retVal;
    }
  }

  function renderOrder() {
    if (order) {
      const longueur = order.length;
      let tab = [];
     
      for (let i = 0; i < longueur; i++) {
        let row = (
          <tr>
            <td>{new Date(order[i].date).toLocaleDateString() + ' ' + new Date(order[i].date).toLocaleTimeString()}</td>
            <td>
              <img
                src={require("../../assets/images/product/gift.png")}
                alt=""
                style={{ maxHeight: "40px"}}
                className="rounded-pill mr-2 border border-info"
              />
              {order[i].offre.titre}
            </td>
            <td style={{ whiteSpace: "pre-line" }}>
              {renderAdress(order[i])}
              {order[i].email}
            </td>

            <td>{renderStatut(order[i])}</td>
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
            {/* <h3>Historique des commandes</h3> */}
            <span>Liste de vos commandes</span>
          </CardHeader>
          <div className="card-block row">
            <Col sm="12" lg="12" xl="12">
              <div className="table-responsive">
                <Table>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Date de commande</th>
                      <th scope="col">
                        Récompenses                        
                      </th>
                      <th scope="col">Adresse d'envoi / Mail</th>
                      <th scope="col">Statut de la commande</th>
                    </tr>
                  </thead>
                  <tbody>{renderOrder()}</tbody>
                </Table>
              </div>
            </Col>
          </div>
        </Card>
      </Col>
    </Row>
  );
}

export default OrderTab;
