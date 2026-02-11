import { MongoConnector } from "../MongoConnector";

export function setupEndpoints(app): void{
    app.get(`health`, (req, res) => {
        const isHealth = MongoConnector.isConnected;
        if(!isHealth){
            res.code(400);
            res.json({
                status: "bad",
                db: "bad"
            })
        }else{
            res.code(200);
            res.json({
                status: "ok",
                db: "ok"
            })
        }
    });
}