import { MongoConnector } from "../connectors/MongoConnector";
import { EnergyReading } from "../schems/EnergyReading";

export class InternalElectricityPriceService {
    public static async handleRequest(startDate: Date, endDate: Date, location: string): Promise<{isSuccess: boolean, message?: string, data: EnergyReading[]}>{
        try{
            const startDateTime = startDate.getTime();
            const endDateTime = endDate.getTime();
            const col = await MongoConnector.getCollection<EnergyReading>();
            const data = await col.find().toArray();
            const allowed = data.filter(x => {
                const dateTime = new Date(x.timestamp).getTime();
                return dateTime >= startDateTime && dateTime <= endDateTime && x.location.toLowerCase() == location.toLowerCase();
            });
            return {
                    isSuccess: true,
                    data: allowed.map(x => {
                    delete x._id
                    return x;
                })
            }
        }catch(err){
            console.log(`Error while handling internal electricity price service`, err);
            return {
                isSuccess: false,
                data: [],
                message: "Error while server handled the request. Check the backend console for more details"
            };
        }
    }
}