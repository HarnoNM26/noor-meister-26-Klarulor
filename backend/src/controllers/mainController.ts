import { MongoConnector } from "../connectors/MongoConnector";
import { isISOFormat } from "../functions";
import { EnergyReading } from "../schems/EnergyReading";
import { DeletingService } from "../services/DeletingService";
import { EleringSystemSynchronizator } from "../services/EleringSystemSynchronizator";
import { HealtService } from "../services/HealthService";
import { InternalElectricityPriceService } from "../services/InternalElectricityPriceService";
import { JsonImpoerService } from "../services/JsonImportService";
import { PriceInsightsService } from "../services/PriceInsightsService";

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
            console.log(`Error while handling the request`, err.message);
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
            console.log(`Error while handling the request`, err.message);
        }

    });

    app.post(`/api/sync/prices`, async (req, res) => {
        try{
            let {start, end, location} = req.query;
            if(!isISOFormat(start) || !isISOFormat(end)){
                const curDate = new Date(Date.now());
                const startDate = new Date(curDate.getUTCFullYear(), curDate.getUTCMonth(), curDate.getDate(), 0,0,0);
                const endDate = new Date(curDate.getUTCFullYear(), curDate.getUTCMonth(), curDate.getDate(), 23, 59, 59);
                start = startDate.toISOString();
                end = endDate.toISOString();

                if(endDate.getTime() < startDate.getTime()){
                    res.status(400).end(`End date must be greater that start date`);
                    return;
                }
            }
            if(!location){
                location = 'EE';
            }

            const obj = await EleringSystemSynchronizator.handleRequest(start,end,location);
            if(!obj){
                res.status(400).json({error: "PRICE_API_UNVAILABLE"});
            }else res.status(200).end();
        }catch(err){
            console.log(`Error while handling controller post request at /api/sync/prices`, err.message);
            res.status(400).end("Server issues to handle this data");
        }
    });

    app.delete(`/api/readings`, async (req, res) => {
        try{
            const {source} = req.query;
            if(source !== "UPLOAD"){
                res.status(400).end(`Query parameter 'source' must be UPLOAD, not any others now`);
                return;
            }

            const deleted = await DeletingService.deleteEntities(source);
            if(deleted == null){
                res.status(400).end(`Happened error on server side. Check backend`);
                return;
            }
            res.status(200).json({
                deleted
            });
        }catch(err){
            console.log(`Error while handling controller post request at /api/readings`, err.message);

            res.status(400).end(`Happened error on server side. Check backend`);
        }
    })

    app.get(`/api/insights/prices`, async (req, res) => {
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
            const data = await PriceInsightsService.getInsights(startDate, endDate, location);
            res.status(200).json(data);
        }catch(err){
            req.status(400).end("Happened error on server side");
        }

    });
}