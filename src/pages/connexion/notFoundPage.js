import React, { Fragment }from "react";
import { Card, CardBody } from "reactstrap";
function NotFoundPage() {
  return (
        <div className ="m-5 p-5">

            <Card className="card card-g-info ">
                <CardBody className="text-center">
                <p style={{  fontSize: 40, fontWeight: 800, padding: "2%" }}>
                    404
                </p>

                <p style={{ padding: "1%",fontSize: 30 }}          >
                    Page introuvable.
                </p>
                </CardBody>
            </Card>
        </div>
   
  );
}
export default NotFoundPage;
