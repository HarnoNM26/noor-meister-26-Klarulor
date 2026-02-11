import * as axios from 'axios';

const start = "1922-03-11T12:06:28.502Z";
const end = "2020-02-11T12:06:28.502Z";
const location = "EE";


axios.post("http://127.0.0.1:3000/api/import/json", 
    [{
        timestamp: start,
        location: "ee",
        price_eur_mwh: 152021243412
    }]
).then(x => console.log(x.data));



// axios.get(`http://127.0.0.1:3000/api/readings?start=${start}&end=${end}&location=${location}`).then(x => console.log(x.data)).catch(x => console.log(`Code: ${x.status}`, `Data: ${x.response?.data}`));