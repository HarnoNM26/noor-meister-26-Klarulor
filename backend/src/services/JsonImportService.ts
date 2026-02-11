import { ObjectId } from "bson";
import { MongoConnector } from "../connectors/MongoConnector";
import { EnergyReading } from "../schems/EnergyReading";
import { PostEnergyReadingDto } from "../dto/post.data.dto";
const moment = require('moment');

type HandleRequestReturnType = {success: boolean, successResponse?: { skipped: number, inserted: number, duplicatesDetected: number} | undefined};

export class JsonImpoerService{
    public static async handleRequest(data: PostEnergyReadingDto[] | PostEnergyReadingDto): Promise<HandleRequestReturnType>{
        if(!data){
            return {
                success: false,
            }
        }
        
        const arr = Array.isArray(data) ? data : [data];

        let skipped = 0;
        let duplicates = 0;

        const col =  await MongoConnector.getCollection<EnergyReading>();
        const cache: EnergyReading[] = await col.find({}).toArray();
        let nextId = cache.length == 0 ? 0 : cache.sort((a,b) => a.id > b.id ? -1 : 1)[0].id+1;
        const append: EnergyReading[] = [];
        for(const x of arr){
            try{
                const momentDate = moment(x.timestamp, moment.ISO_8601, true);
                if(!momentDate.isValid() || !isNaN(+x.timestamp))
                {
                    skipped++;
                    continue;
                }
                if(!x.location)
                    x.location = 'EE';
                if(typeof x.price_eur_mwh != "number"){
                    skipped++;
                    continue;
                }

                if(append.find(z => x.location == z.location && x.timestamp == z.timestamp) 
                    ||
                    cache.find(z => x.location == z.location && x.timestamp == z.timestamp)
                ){
                    duplicates++;
                    continue;
                }

                append.push({
                    ...x,
                    id: nextId++,
                    source: "UPLOAD",
                    created_at: new Date(Date.now())
                });
            }catch(err){
                skipped++;
                console.log(`Happened exception while checking object`, err, "object", x);
            }
        }

        
        for(const x of append){
           col.insertOne({
            ...x,
            _id: new ObjectId()
           });
        }
        let inserted = append.length;

        return {
            success: true,
            successResponse: {
                skipped,
                duplicatesDetected: duplicates,
                inserted
            }
        };
    }
}