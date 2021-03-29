//Interface admin...
import React, { Fragment,useState, useEffect } from "react";
import Breadcrumb from "../common/breadcrumb/breadcrumb";
import { Container, Card, CardBody,Table,Input ,Label,FormGroup, Form} from "reactstrap";
import SweetAlert from "sweetalert2";

import authHeader from "../../auth-header";
import "./orderList.css";
import { orderStatutList as statutLst } from "../../helpers/orderStatutList";


const OrderList = (props) => {

  const [orders, setOrders] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(getOrders, [refresh]);
  async function getOrders() {
    const options = {
      method: "GET",
      headers: authHeader(),
    };

    let url = process.env.REACT_APP_REWARDS_BACK_HOST + "/admin/cmd";
    const response = await fetch(url, options);
    const responseData = await response.json();
    setOrders(responseData.orders); //
  } 

  async function onUpdateCmdClicked(order, newStatut){
    if(order){
      if(newStatut.value==="refunded"){
       SweetAlert.fire({
         title: "Etes-vous sûr de vouloir rembourser cette commande (il ne sera pas possible d'annuler cette action)?",
         showCancelButton: true,
         confirmButtonText: `Rembourser`,
         cancelButtonText: `Annuler`,
         icon: "warning",
       }).then(async (result) => {
         if (result.isDismissed) {         
           setRefresh(true) ;
         }else {
           await postStatut(order, newStatut);
         }
       });
      } else {
         await postStatut(order, newStatut);
      } 
    }  
   }

   async function postStatut(order, newStatut){
     try {
       order.statut = newStatut.value;     
       var options = {
         method: "POST",
         body: JSON.stringify(order),
         headers: authHeader(),
       };
       let url = process.env.REACT_APP_REWARDS_BACK_HOST + "/admin/modifer-cmd"; 
       const response = await fetch(url, options);
       const responseData = await response.json();
       if( orders && responseData?.success){
         const elementIndex = orders.findIndex((el) => el._id === order._id);
         if (elementIndex != -1) {
           let newData = [...orders];
           newData[elementIndex]=order;          
           setOrders(newData);
         }
       }    
     } catch (error) {
       SweetAlert.fire({ title: "Une erreur s'est produite!" });
     }
   }

  function renderUser(order){
    let usrName="";
    let usrMail="";
    if(order?.usernameOriginal ) usrName=(<small className="d-block">{order?.usernameOriginal}</small>);
    if(order?.emailUserOriginal ) usrMail=(<small className="d-block">{order?.emailUserOriginal}</small>);
    if(order?.usernameOriginal || order?.emailUserOriginal){
      return (<div>{usrName}{usrMail} </div>);
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

  function renderOrders() {
    
    if (orders) {
      return orders.map((order) => (
        <tr>
          <td className="pl-3 pr-1">
            <div>{new Date(order.date).toLocaleDateString() + ' ' + new Date(order.date).toLocaleTimeString()}</div>
            {renderUser(order)}
          </td>
          <td className="px-1">{order.offre.titre}</td>
          <td className="px-1" style={{whiteSpace:'pre-line', fontSize:'12px'}}>          
            {renderAdress(order)}
            {order.email}
          </td>        
          <td className="px-1">          
            <Form><FormGroup className="d-lg-flex m-0 p-0"> {renderModifComponents(order)} </FormGroup></Form>
          </td>
        </tr>
      ));
    }
  }



function renderModifComponents(order) {
  //const styleChecked={}
  return statutLst.map((st) => (        
    // <FormGroup check className={ st.value !== order.statut ? 'mx-1':'mx-1 border'} style={{backgroundColor:st.color, color:st.textcolor}} ></FormGroup>
      <FormGroup check className={`mr-1 my-md-1 my-sm-1 rounded`}  style={{backgroundColor : st.color, color : st.textcolor}} >
        <Label check className={`mr-1  p-2`}  style={ st.value !== order.statut ? { fontWeight: 'normal', fontSize:'12px' } : { fontWeight: 'bold', fontSize:'12px' } }>  
        {/* <Label check className='mr-1 p-1' style={ st.value !== order.statut ? { fontWeight: 'normal' } : { fontWeight: 'bold' } }>   */}       
          <Input
            type="radio"
            name="statut"
            // defaultChecked ={st.value === order.statut}
            checked ={st.value === order.statut}
            value={st.value}
            onChange={()=>onUpdateCmdClicked(order,st)}
            className='statutCmd'
            disabled={order.statut==='refunded'}
          />
          {st.txt}
        </Label>
      </FormGroup>    
  ));
} 

  return (
    <Fragment>
      <Breadcrumb parent="Default" title="Commandes en cours" />
      <Card >
        <CardBody className="px-0 table-responsive">
            <Table className="table ">
              <thead className="thead-light" style={{backgroundColor:'#0099DD'}}>
                <tr>
                  <th >Date</th>
                  <th >Récompenses</th>
                  <th >Adresse d'envoi / Mail</th>
                  <th >Statut de la commande</th>                    
                </tr>
              </thead>
              <tbody>{renderOrders()}</tbody>
            </Table>
          <div >
          </div>
        </CardBody>
      </Card>
      <Container fluid={true}>
      </Container>
    </Fragment>
  );
}

export default OrderList;
