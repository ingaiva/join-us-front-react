import React, { Fragment, useContext, useEffect, useState } from "react";
import Breadcrumb from "../common/breadcrumb/breadcrumb";
import Apexchart from "react-apexcharts";
import { apexRadialBarChart } from "./apexchartsData";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import Giver from "./giver";
import Taker from "./taker";
import Park from "./park";
import { AppContext } from "../../index";
import { actionStatutList as statutLst } from "../../helpers/actionStatutList";

const Apexcharts = (props) => {
  const context = useContext(AppContext);

  const [series, setSeries] = useState([]);  
  const [chartOptions, setChartOptions]= useState(apexRadialBarChart.options);

  function getValues(){
   
    let tab=[];  
    statutLst.forEach(element => {      
      if(element.value===context.actionParked){
        tab.push(element.value)
      }
    });
    statutLst.forEach(element => {     
      if(element.value===context.actionTaker ){
        tab.push(element.value)
      }
    });
    statutLst.forEach(element => {     
      if(element.value===context.actionGiver){
        tab.push(element.value)
      }
    });
    return tab;
  }
  
  function getLabels(){
    let tab=[]; 
    const values=getValues() ;
    values.forEach(el => {
      const st = statutLst.find((st) => st.value === el);
      if (st) tab.push(st.txt);   
   });  
    return tab;
  }

  useEffect(updateChartSettings, [context.user]);

  function updateChartSettings() {
    if (Array.isArray(context.user?.stats)) {
     
      let total = 0;
      context.user.stats.forEach((element) => {
        total += element.solde;
      });
      if (total == 0) total = 1;
    
      let newOptions = {...chartOptions};
      newOptions.labels=getLabels();
      setChartOptions(newOptions);

      setSeries(
        // context.user.stats.map((stat) => Math.round((stat.solde * 100) / total))
        getValues().map((val) => {
          const stat = context.user.stats.find((st) => st.action === val);
          if (stat) return Math.round((stat.solde * 100) / total);
          else return 0;
        })
      );
    }
   
  }

  return (
    <Fragment>
      <Breadcrumb parent="Default" title="Vos stats" />
      <Container fluid={true}>
        <Row
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0%",
          }}
        >
          <Col sm="6" xl="6  xl-100">
            <Card>
              <CardBody style={{ marginTop: "5%", padding: 0 }}>
                <div id="circlechart">
                  <Apexchart                   
                    options={chartOptions}
                    series={series}
                    type="radialBar"
                    height={500}                    
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col sm="6" xl="6  xl-100">
            <Row style={{ marginBottom: -10 }}>
              <Park />
            </Row>
            <Row style={{ marginBottom: -10 }}>
              <Taker />
            </Row>
            <Row style={{ marginBottom: -10 }}>
              <Giver />
            </Row>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Apexcharts;
