export default function headerWithToken (){
  if (localStorage.getItem(process.env.REACT_APP_LS_KEY)) {
    const userToken = localStorage.getItem(process.env.REACT_APP_LS_KEY);
    if (userToken) {
      return { Authorization: "Bearer " + userToken ,'Content-Type': 'application/json'};  
    }
  }
   return {};
};
     
