import { Collection, MongoClient } from "mongodb";

export class MongoConnector{
    private static _isConnected: boolean;
    private static _client: MongoClient;

    public static get isConnected(){
        return MongoConnector._isConnected;
    }

    public static connect(): void{
        try{
            MongoConnector._client = new MongoClient('mongodb://127.0.0.1:27017');
        }catch(err){
            console.log(`Error while connecting to mongodb`, err);
            process.exit(1);
        }
    }

    public static getCollection<T>(name: string){
        const db = MongoConnector._client.db("database1");
        return db.collection<T>(name);
    }
}