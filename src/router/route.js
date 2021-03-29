// starter kit
import Acceuil from "../pages/acceuil/acceuil";
import Commande from "../pages/commande/commande";
import Action from "../pages/action/action";
import Admin from "../pages/pageAdmin/pageAdmin";
import Connexion from "../pages/connexion/connexion";


export const routes = [
  { path: "/accueil", Component: Acceuil, mode:"loggedIn" },
  { path: "/commande", Component: Commande , mode:"loggedIn"},
  { path: "/historique-action", Component: Action , mode:"loggedIn"},
  // { path: "/admin", Component: Admin , mode:"loggedIn"},
  
  { path: "/connexion/:link", Component: Connexion , mode:"loggedIn"},
  { path: "/connexion", Component: Connexion , mode:"loggedIn"},
  
  
  { path: "*", Component: Connexion , mode:"loggedOut"},

  { path: "/", Component: Acceuil, mode:"loggedIn" },
  
];
