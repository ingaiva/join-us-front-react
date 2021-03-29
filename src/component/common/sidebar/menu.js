import React from "react";
export const MENUITEMS = [
  {
    title: "Accueil",
    icon: <i className="pe-7s-home pe-lg"></i>,
    path: "/accueil",
    type: "sub",
    active: true,
    bookmark: true,
  },
  {
    title: "Commandes",
    icon: <i className="pe-7s-edit"></i>,
    path: "/commande",
    type: "sub",
    active: false,
  },
  {
    title: "Actions",
    icon: <i className="pe-7s-note2"></i>,
    path: "/historique-action",
    type: "sub",
    active: false,
  },
];
