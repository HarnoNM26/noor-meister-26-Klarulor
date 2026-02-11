import { ObjectId } from "bson";
import { MongoConnector } from "../connectors/MongoConnector";
import { EnergyReading } from "../schems/EnergyReading";
import { EleringService } from "./EleringService";

export class EleringSystemSynchronizator {
    public static async handleRequest(startIso: string, endIso: string, location: string): Promise<boolean> {
        const priceData = await EleringService.getPriceRanges(startIso, endIso, location.toLowerCase());

        if(!priceData){
            return false;
        }

        const col = await MongoConnector.getCollection<EnergyReading>();
        const cache = await col.find().toArray();
        let nextId = cache.length == 0 ? 0 : cache.sort((a,b) => a.id > b.id ? -1 : 1)[0].id+1;

        for(const x of priceData){
            const price = x.price;
            const cacheTarget = cache.find(z => z.location.toLowerCase() == location.toLowerCase() && new Date(z.timestamp).getTime() == x.timestamp);
            if(cacheTarget){
                await col.updateOne({_id: cacheTarget._id}, {$set: {price_eur_mwh: price}});
            }else{

                
                const obj: EnergyReading = {
                    id: nextId++,
                    price_eur_mwh: price,
                    location: location.toUpperCase(),
                    timestamp: new Date(x.timestamp*1000).toISOString(),
                    created_at: new Date(Date.now()),
                    source: 'API'
                }
                await col.insertOne({
                    ...obj,
                    _id: new ObjectId()
                });
            }
        }

        return true;
    }
}