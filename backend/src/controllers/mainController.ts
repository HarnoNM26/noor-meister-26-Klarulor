import { MongoConnector } from "../connectors/MongoConnector";
import { HealtService } from "../services/HealthService";

export function setupEndpoints(app): void{
    app.get(`/health`, (req, res) => {
        const isHealth = HealtService.checkHealth();
        if(!isHealth){
            res.status(400);
            res.json({
                status: "ok", // ok means that http server is running so it can handle requests
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