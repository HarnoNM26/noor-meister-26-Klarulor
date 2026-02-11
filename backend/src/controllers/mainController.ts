import { MongoConnector } from "../connectors/MongoConnector";

export function setupEndpoints(app): void{
    app.get(`/health`, (req, res) => {
        const isHealth = MongoConnector.isConnected;
        if(!isHealth){
            res.status(400);
            res.json({
                status: "bad",
                db: "bad"
            })
        }else{
            res.status(200);
            res.json({
                status: "ok",
                db: "ok"
            })
        }
    });
}