import React, { Fragment, useContext } from "react";
import { Card, CardBody } from "reactstrap";
import { AppContext } from "../../index";
import { actionStatutList as statutLst } from "../../helpers/actionStatutList";
import "./styleStats.css";

const CreativeCards = () => {
  const context = useContext(AppContext);


  return (
    <Fragment>
      <Card className="card card-g-success w-75">
        <CardBody className='stat-card-body py-1 px-2' >
          <p className='p-stat-value border border-2 rounded-circle'>
            {context.takerActions()}
          </p>
          <p className='p-stat-text'>
           {statutLst.find((st) => st.value === context.actionTaker)?.description}
            {/* Nombre de fois où vous avez cherché un service via votre {process.env.REACT_APP_TITLE_MOBILE_APP} */}
          </p>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default CreativeCards;
