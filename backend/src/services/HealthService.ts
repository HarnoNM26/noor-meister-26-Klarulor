import { MongoConnector } from "../connectors/MongoConnector";

export class HealtService{
    public static checkHealth(): boolean {
        return MongoConnector.isHealth;;
    }
}