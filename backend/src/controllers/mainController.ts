import { MongoConnector } from "../connectors/MongoConnector";
import { EnergyReading } from "../schems/EnergyReading";
import { HealtService } from "../services/HealthService";
import { InternalElectricityPriceService } from "../services/InternalElectricityPriceService";
import { JsonImpoerService } from "../services/JsonImportService";

export function setupEndpoints(app): void{
    app.get(`/api/health`, (req, res) => {
        const isHealth = HealtService.checkHealth();
        if(!isHealth){
            res.status(200);
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
    app.post('/api/import/json', async (req,res) => {
        try{
            const body = req.body;
            const data = await JsonImpoerService.handleRequest(body);
            res.status(200).json(data);
            
        }catch(err){
            res.status(400).end("Server issues to handle this data");
            console.log(`Error while handling the request`, err);
        }
    });
    app.get(`/api/readings`, async (req,res) => {
        try{
            const {start, end, location} = req.query;

            if(!start || !end || !location){
                res.status(400);
                res.end("Bad request. No start or end or location query paramethers");
                return;
            }

            const startDate = new Date(start);
            const endDate = new Date(end);

            if(!isNaN(+start) || !isNaN(+end)){
                res.status(400);
                res.end("Bad request. Start and end date must be in ISO 8601 format!");
                return;
            }

            if(isNaN(startDate.getTime()) || isNaN(endDate.getTime())){
                res.status(400);
                res.end("Bad request. Bad start or end data was provided");
                return;
            }

            if(typeof location !== "string" || !["ee", "lv", "fi"].includes(location.toLowerCase())){
                res.status(400);
                res.end("Bad request. Only EE, LV, FI countries are allowed");
                return;
            }
            const data = await InternalElectricityPriceService.handleRequest(startDate, endDate, location);
            res.status(data.isSuccess ? 200 : 400);
            if(data.isSuccess){
                res.json(data.data);
            }else res.end(data.message);
        }catch(err){
            res.status(400).end("Server issues to handle this data");
            console.log(`Error while handling the request`, err);
        }

    });
}