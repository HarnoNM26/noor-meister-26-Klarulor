import * as axios from 'axios';

const start = "1921-03-11T12:06:28.502Z";
const end = "2029-02-11T12:06:28.502Z";
const location = "AA";


// axios.post("http://127.0.0.1:3000/api/import/json", 
//     [{
//         timestamp: start,
//         location: "lv",
//         price_eur_mwh: 666
//     }]
// ).then(x => console.log(x.data));



axios.get(`http://127.0.0.1:3000/api/readings?start=${start}&end=${end}&location=${location}`).then(x => console.log(x.data)).catch(x => console.log(x, `Code: ${x.status}`, `Data: ${x.response?.data}`));