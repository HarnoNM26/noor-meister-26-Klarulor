import { Collection, Db, MongoClient, } from "mongodb";

const collection_name = "EnergyReading";

export class MongoConnector{
    private static _isConnected: boolean;
    private static _isHealth: boolean;
    private static _client: MongoClient;

    public static get isConnected(){
        return MongoConnector._isConnected;
    }
    public static get isHealth(){
        return MongoConnector._isHealth;
    }

    public static async connect(): Promise<boolean>{
        try{
            MongoConnector._client = new MongoClient('mongodb://127.0.0.1:27017');
            MongoConnector._client.on(`close`, () => {
                this._isConnected = false;
                this._isHealth = false;
                console.log(`Database connection is closed. Check it and restart this backend!\nSome services may be broken!!!`);
            })
            console.log(`Successfully connected to db`);
            this._isConnected = true;
            return true;
        }catch(err){
            console.log(`Error while connecting to mongodb`, err.message);
            return false;
        }
    }

    public static async migrate(): Promise<boolean>{
        const db = MongoConnector._client.db("database1");
        return await MongoConnector.tryCreateCollection(db);
    }

    public static async getCollection<T>(name: string = collection_name): Promise<Collection<T>>{
        const db = MongoConnector._client.db("database1");
        return db.collection<T>(name);
    }

    private static async tryCreateCollection(db: Db): Promise<boolean>{
        try{
            const colls = await db.listCollections().toArray();
            if(!colls.find(x => x.name == collection_name)){
                await db.createCollection(collection_name);
                console.log(`Successfully migrated with collection`);
                return true;
            }else console.log(`Migration already is produced some collections. If you need it again, delete old collections`);
            return false;
        }catch(err){
            console.log(`Cant create collection`, err.message);
            return false;
        }
    }

    public static async checkHealth(): Promise<boolean>{
        const db = MongoConnector._client.db("database1");;
        const colls = await db.listCollections().toArray();
        this._isHealth = !!colls.find(x => x.name == collection_name);
        return this._isHealth;
    }
}