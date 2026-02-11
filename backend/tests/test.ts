import * as axios from 'axios';


// axios.post("http://127.0.0.1:3000/api/import/json", 
//     [{
//         timestamp: (new Date(1111)).toISOString(),
//         location: "ee",
//         price_eur_mwh: 150
//     },
// {
//         timestamp: (new Date(1111)).toISOString(),
//         location: "ee",
//         price_eur_mwh: 150
//     }]
// ).then(x => console.log(x.data));

const start = "1900-02-11T12:06:28.502Z";
const end = "2020-02-11T12:06:28.502Z";
const location = "EE";

axios.get(`http://127.0.0.1:3000/api/readings?start=${start}&end=${end}&location=${location}`).then(x => console.log(x.data));