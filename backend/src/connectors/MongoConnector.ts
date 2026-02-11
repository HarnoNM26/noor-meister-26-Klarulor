import { Collection, Db, MongoClient, } from "mongodb";

const collection_name = "EnergyReading";

export class MongoConnector{
    private static _isConnected: boolean;
    private static _client: MongoClient;

    public static get isConnected(){
        return MongoConnector._isConnected;
    }

    public static async connect(): Promise<void>{
        try{
            MongoConnector._client = new MongoClient('mongodb://127.0.0.1:27017');
            console.log(`Successfully connected to db`);
            this._isConnected = true;
        }catch(err){
            console.log(`Error while connecting to mongodb`, err);
            process.exit(1);
        }
    }

    public static async migrate(): Promise<void>{
        const db = MongoConnector._client.db("database1");
        await MongoConnector.tryCreateCollection(db);
    }

    public static async getCollection<T>(name: string): Promise<Collection<T>>{
        const db = MongoConnector._client.db("database1");
        return db.collection<T>(name);
    }

    private static async tryCreateCollection(db: Db): Promise<void>{
        try{
            const colls = await db.listCollections().toArray();
            if(!colls.find(x => x.name == collection_name)){
                await db.createCollection(collection_name);
                console.log(`Successfully created collection`);
            }
        }catch(err){
            console.log(`Cant create collection`, err);
            process.exit(1);
        }
    }

    public static async checkHealth(): Promise<boolean>{
        const db = MongoConnector._client.db("database1");;
        const colls = await db.listCollections().toArray();
        return !!colls.find(x => x.name == collection_name);
    }
}