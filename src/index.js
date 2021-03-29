import React, { Fragment, useEffect, useState, createContext } from "react";
import ReactDOM from "react-dom";
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  useLocation,useHistory
} from "react-router-dom";
import "./index.scss";

import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./store/index";
import App from "./App";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { routes } from "./router/route";
import ConfigDB from "./data/customizer/config";

import authHeader from "./auth-header";
import Error404Page from "./pages/connexion/notFoundPage";
//import Connexion from "./pages/connexion/connexion";

export const AppContext = createContext();

const Root = (props) => {
  const history = useHistory();    
  const [routeMode, setRouteMode] = useState("");
  const [user, setUser] = useState({});
  const [userReload, setUserReload] = useState(false);
  const [catalogue, setCatalogue] = useState([]);

  useEffect(getUser, [userReload]);

  function getActionGiver(){
    return "GIVER.GIVE";
  }
  function getActionTaker(){
    return "TAKER.SEARCH";
  }
  function getActionParked(){
    return "TAKER.PARKED";
  }

  let appContextValue = {
    user,
    logout: function(){
      localStorage.removeItem(process.env.REACT_APP_LS_KEY);   
      setUserReload(true); 
      window.location.reload();         
    },
     
    setUserReload,
    isUser: function () {
      if (user && user?.roles) {
        const adminRole = user?.roles.find(
          (element) => element === "ROLE_USER"
        );
        if (adminRole) return true;
      }
      return false;
    },
    isAdmin: function () {
      if (user && user?.roles) {
        const adminRole = user?.roles.find(
          (element) =>
            element === "ROLE_SUPER_ADMIN" || element === "ROLE_RP_APP"
        );
        if (adminRole) return true;
      }
      return false;
    },
    userTypeLibelle: function(){
      let libelle='';
      if(user){
        if(this.isUser()){
          libelle+="Utilisateur";
        }
        if(this.isAdmin()){
          if (libelle.length > 0) libelle += "  ";
          libelle +='Administrateur';
        }
      }
      return libelle;
    },
    userName: function(){
      let nameUser='';
      if(user){
        return user.username;        
      }
      return '';
    },
    actionGiver:getActionGiver(),
    giverActions: function () {
      if (user && user?.stats) {
        const actionIndex = user?.stats?.findIndex(         
          (el) => el.action === getActionGiver()
        );
        if (actionIndex != -1) {
          return user.stats[actionIndex].solde;
        } else return "0";
      } else return "0";
    },
    actionTaker:getActionTaker(),
    takerActions: function () {
      if (user && user?.stats) {
        const actionIndex = user?.stats?.findIndex(
          (el) => el.action === getActionTaker()
        );
        if (actionIndex != -1) {
          return user.stats[actionIndex].solde;
        } else return "0";
      } else return "0";
    },
    actionParked:getActionParked(),
    parkedActions: function () {
      if (user && user?.stats) {
        const actionIndex = user?.stats?.findIndex(
          (el) => el.action === getActionParked()
        );
        if (actionIndex != -1) {
          return user.stats[actionIndex].solde;
        } else return "0";
      } else return "0";
    },
    
    catalogue,
    setCatalogue,
    removeOffre : function (offre) {
      if ( catalogue && offre) {
        const elementIndex = catalogue.findIndex((el) => el._id === offre._id);
        if (elementIndex != -1) {
          let newCatalogue = [...catalogue];
          newCatalogue.splice(elementIndex, 1);          
          setCatalogue(newCatalogue);
        }
      }
    },
    updateOffre : function (offre) {
      if ( catalogue && offre) {
        const elementIndex = catalogue.findIndex((el) => el._id === offre._id);
        if (elementIndex != -1) {
          let newCatalogue = [...catalogue];
          newCatalogue[elementIndex]=offre;          
          setCatalogue(newCatalogue);
        }
      }
    },
  };

  async function getUser() {
    try {
      if (localStorage.getItem(process.env.REACT_APP_LS_KEY)){

        var options = { method: "GET", headers: authHeader() };
        let url = process.env.REACT_APP_REWARDS_BACK_HOST + "/user"; //
        const response = await fetch(url, options);
        const responseData = await response.json();
        let userFromBack = responseData?.user;
        userFromBack.solde = [];
        userFromBack.stats = [];
  
        //statistiques :
        url += "/info";
        const responseTr = await fetch(url, options);
        const responseDataTr = await responseTr.json();
        userFromBack.solde = responseDataTr?.solde;
        userFromBack.stats = responseDataTr?.stats;
        userFromBack.totalTransactions = responseDataTr?.totalTransactions;
        userFromBack.lastTransactions = responseDataTr?.lastTransactions;        
  
        if (userFromBack.idUserOriginal) {
          setRouteMode("loggedIn");
        }
        setUser(userFromBack);
      }else {
        setUser(null);
        setRouteMode("loggedOut");
      }
    } catch (error) {
      setUser(null);
      setRouteMode("loggedOut");
    }
  }

  const [anim, setAnim] = useState("");
  const animation =
    localStorage.getItem("animation") || ConfigDB.data.router_animation;
  const abortController = new AbortController();

  useEffect(() => {
    setAnim(animation);
    const layout = localStorage.getItem("layout_version");
    document.body.classList.add(layout);
    const color = localStorage.getItem("color");
    document
      .getElementById("color")
      .setAttribute(
        "href",
        `${process.env.PUBLIC_URL}/assets/css/${color}.css`
      );
    console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
    console.disableYellowBox = true;

    getUser();

    return function cleanup() {
      abortController.abort();
    };

    // eslint-disable-next-line
  }, []);

  function renderErrorPage() {
    if (routeMode) {
      try {
        let curPath = window.location.pathname;
        if (window.location.pathname.split("/").length > 1) {
          curPath = window.location.pathname.split("/")[1];
        }

        if (
          routes.filter(
            (route) =>
              route.mode === routeMode &&
              (route.path === "*" || route.path.split("/")[1] === curPath)
          ).length === 0
        ) {
          return <Route path="*" component={Error404Page}></Route>;
        }
      } catch (error) {
        console.log(" route error : " + JSON.stringify(error));
      }
    }
  }

  return (
    <Fragment>
      <Provider store={store}>
        <BrowserRouter basename={`/`}>
          <AppContext.Provider value={appContextValue}>
            <Switch>
              <Fragment>
                <App>
                  <TransitionGroup>
                    {routes
                      .filter((route) => route.mode === routeMode)
                      .map(({ path, Component }) => (
                        <Route key={path} exact path={path}>
                          {({ match }) => (
                            <CSSTransition
                              in={match != null}
                              timeout={500}
                              classNames={anim}
                              unmountOnExit
                            >
                              <div>
                                <Component />
                              </div>
                            </CSSTransition>
                          )}
                        </Route>
                      ))}
                    {renderErrorPage()}
                  </TransitionGroup>
                </App>
              </Fragment>
            </Switch>
          </AppContext.Provider>
        </BrowserRouter>
      </Provider>
    </Fragment>
  );
};
ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
