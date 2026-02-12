import * as axios from 'axios';
 const start = "2026-01-11T12:05:19.502Z";
const end = Date.now();
const location = "EE";
const base_url = "https://dashboard.elering.ee";



// // EleringService.getPriceRanges(start,end,"ee").then(console.log);


// axios.post("http://127.0.0.1:3000/api/import/json", 
//     [{
//         timestamp: start,
//         location: "ee",
//         price_eur_mwh: 7770
//     }]
// ).then(x => console.log(x.data));



axios.get(`http://127.0.0.1:3000/api/insights/prices?start=${start}&end=${end}&location=${location}`).then(x => console.log(x.data)).catch(x => console.log(x, `Code: ${x.status}`, `Data: ${x.response?.data}`));