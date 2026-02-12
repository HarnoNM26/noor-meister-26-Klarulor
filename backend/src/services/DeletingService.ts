import { MongoConnector } from "../connectors/MongoConnector";
import { EnergyReading } from "../schems/EnergyReading";

export class DeletingService {
    public static async deleteEntities(source: 'UPLOAD' | 'API'): Promise<number | null> {
        try{
            const col = await MongoConnector.getCollection<EnergyReading>();
            const status = await col.deleteMany({source: source});

            if(!status.acknowledged)
                return null;

            return status.deletedCount;
        }catch(err){
            console.log(`Error while handling service request`, err);
        }
        return null;
    }
}