import * as axios from 'axios';
import { EleringService } from '../src/services/EleringService';

const start = "2026-01-11T12:06:28.502Z";
const end = "2026-03-11T12:06:28.502Z";
const location = "EE";
const base_url = "https://dashboard.elering.ee";



// EleringService.getPriceRanges(start,end,"ee").then(console.log);


axios.post("http://127.0.0.1:3000/api/import/json", 
    [{
        timestamp: start,
        location: "lv",
        price_eur_mwh: 7777
    }]
).then(x => console.log(x.data));



axios.get(`http://127.0.0.1:3000/api/readings?start=${start}&end=${end}&location=${location}`).then(x => console.log(x.data)).catch(x => console.log(x, `Code: ${x.status}`, `Data: ${x.response?.data}`));