import configDB from "../data/customizer/config";
const secondary = configDB.data.color.secondary_color;
const success = configDB.data.color.success_color;
const info = configDB.data.color.info_color;
export const actionStatutList = [
    { value: "GIVER.GIVE", txt: "Proposer un service", description: "Vous avez proposé un service", descriptionNone: "Vous n'avez proposé aucun service", textcolor:info },
    { value: "TAKER.SEARCH", txt: "Rechercher un service", description: "Vous avez cherché un service",descriptionNone: "Vous n'avez cherché aucun service",textcolor:success },
    { value: "GIVER.MATCH", txt: "Trouver un correspondant", description: "Vous avez trouvé un correspondant", descriptionNone: "Vous n'avez trouvé aucun correspondant",textcolor:'#480ca8' },
    { value: "TAKER.PARKED", txt: "Utiliser un service collaboratif", description: "Vous avez utilisé un service collaboratif", descriptionNone: "Vous n'avez utilisé aucun service collaboratif" , textcolor:secondary },
    { value: "USER.ORDER", txt: "Commander", description: "Vous avez commandé", descriptionNone: "Vous n'avez pas commandé",textcolor:'#e85d04' },
    { value: "USER.BUY", txt: "Acheter", description: "Vous avez acheté", descriptionNone: "Vous n'avez rien acheté",textcolor:'#dc2f02' },
    { value: "GIVER.SPOT", txt: "Spot", description: "Spot", descriptionNone: "Aucun spot",textcolor:'#d90429' },
  ];

  