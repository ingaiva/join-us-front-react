import React, { Fragment, useContext } from "react";
import { Card, CardBody } from "reactstrap";
import { useHistory,useParams, useLocation } from "react-router-dom";


import { useState, useEffect } from "react";
import authHeader from "../../auth-header";
import { AppContext } from "../../index";

function Connexion() {
    let location = useLocation();
    const context = useContext(AppContext);
    
    const [verified, setVerified] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");
    let { link } = useParams();
    const history = useHistory();
    const redirect = () => history.push("/");
    
    useEffect(getToken, []);

    async function getToken() {
        if(!link && location.pathname.startsWith("/connexion/")){
            link=location.pathname.replace("/connexion/","");
        }
        if(!link){
            setErrorMsg("Utilisez le lien reçu par mail pour vous connecter." );         
            setVerified(-1); 
            context.setUserReload(true);
        } else {
            try {            
                var options = { method: "GET"};
                let url = process.env.REACT_APP_REWARDS_BACK_HOST + "/user/login/" +link; 
                const response = await fetch(url, options);
                const responseData = await response.json();
                //token
                if(responseData.success && responseData.token){
                    let tokenFromBack = responseData.token;
                    localStorage.setItem(process.env.REACT_APP_LS_KEY, tokenFromBack); 
                    setVerified(1);
                   
                    context.setUserReload(true);
                    redirect();             
    
                }else {
                    setErrorMsg("Utilisateur non authentifié");
                    setVerified(-1);   
                    context.setUserReload(true); 
                }
            } catch (error) {
                setErrorMsg("Votre lien n'est plus valide. Utilisateur non authentifié." );
                console.log("'Votre lien n'est plus valide. Utilisateur non authentifié' -> getToken : " + error.message);
                setVerified(-1); 
                context.setUserReload(true);   
            } 
        }
      }

      function render() {
        if (verified===0) {
            return (
                <div className="text-center">             
                  <h1 className="">Connexion...</h1>                 
                </div>
              );
        }
        else if (verified===-1) {
          return (
            <div className="m-5 p-5">
            <Card className="card card-g-info " >
                <CardBody className="text-center">
                <p style={{ fontSize: 20 }}>{errorMsg}</p>
                </CardBody>
            </Card>
            </div> 
          );
        } else if (verified===1) {
          return (<div className="d-none">Connexion réussie...</div>);
        }
      }

    
    return(<div>{render()}</div>);
}
export default Connexion;