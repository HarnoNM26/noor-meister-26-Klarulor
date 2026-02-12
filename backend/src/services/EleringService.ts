import * as axios from 'axios';

const base_url = "https://dashboard.elering.ee";


export class EleringService{
    public static async getPriceRanges(start: string, end: string, field: string): Promise<{timestamp: number, price: number}[]>{
        try{
            const res = await axios.get(`${base_url}/api/nps/price?start=${start}&end=${end}&fields=${field}`);
            const obj = res.data as any;
            if(obj.success && obj.data[field.toLowerCase()]){
                return obj.data[field.toLowerCase()];
            }
            return null;
        }catch(err){
            console.log(err.message,`\n!!! In the top you can see almost http response from elering.\n Start: ${start} | End: ${end} | Field: ${field}`);
            return null;
        }
    }
}