import { MongoConnector } from "../connectors/MongoConnector";
import { EnergyReading } from "../schems/EnergyReading";

type GetInsightsResponseType = {
    average_price: number;
    min_price: number;
    max_price: number;
    cheapest_slots: {price: number, date: number}[];
    most_expensive_slots: {price: number, date: number}[];
}

export class PriceInsightsService{
    public static async getInsights(start: Date, end: Date, location: string): Promise<GetInsightsResponseType>{
        try{
            const startDateTime = start.getTime();
            const endDateTime = end.getTime();
            const col = await MongoConnector.getCollection<EnergyReading>();
            const data = await col.find().toArray();
            const allowed = data.filter(x => {
                const dateTime = new Date(x.timestamp).getTime();
                return dateTime >= startDateTime && dateTime <= endDateTime && x.location.toLowerCase() == location.toLowerCase() && !!x.price_eur_mwh;
            });

            let average = 0;
            for(const x of allowed){
                average += x?.price_eur_mwh ?? 0;
            }
            average = +(average/allowed.length).toFixed(2);
            const sortedRaw = allowed.sort((a,b) => a.price_eur_mwh > b.price_eur_mwh ? 1 : -1);
            console.log(sortedRaw)
            const minPrice = sortedRaw[0].price_eur_mwh;
            const maxPrice = sortedRaw[sortedRaw.length-1].price_eur_mwh;

            let cheapestSlots: {price: number, date: number}[] = [];
            for(let i = 0; i < Math.min(sortedRaw.length, 3); i++){
                cheapestSlots.push({date: new Date(sortedRaw[i].timestamp).getTime(), price: sortedRaw[i].price_eur_mwh});
                console.log(`ch: ${sortedRaw[i].price_eur_mwh}`)
            }
            let expensiveSlots: {price: number, date: number}[] = [];
            sortedRaw.reverse()
            for(let i = 0; i < Math.min(sortedRaw.length, 3); i++){

                expensiveSlots.push({date: new Date(sortedRaw[i].timestamp).getTime(), price: sortedRaw[i].price_eur_mwh});
                console.log(`exp: ${sortedRaw[i].price_eur_mwh}`)
            }

            cheapestSlots = cheapestSlots.sort((a,b) => a.date > b.date ? 1 : -1);
            expensiveSlots = cheapestSlots.sort((a,b) => a.date > b.date ? 1 : -1);



            const obj = {
                average_price: average,
                min_price: minPrice,
                max_price: maxPrice,
                cheapest_slots: cheapestSlots,
                most_expensive_slots: expensiveSlots
            };;
            console.log(obj, expensiveSlots[0].date == cheapestSlots[0].date)
            return obj;
        }catch(err){
            console.log(`Error was while hasndilng thr request`, err);
        }
    }
}