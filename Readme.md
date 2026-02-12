# Noormeister 2026 Module A&B&C by Klarulor

## Instructions
1. Every console out may be not the same as here in readme file because here is full guide how to run. There is professional execution context. 

## Tools
1. MongoDB - Database with dynamic schema that runs at 27017 port
2. NodeJS - V8 Javascript Engine Runtime
3. Typescript Language 

## Backend
Warning! Backend using internet for external Elering API.
### Using libraries:
1. Express - http server
2. Cors - Security for http server
3. Mongodb - Connector to MongoDB database
4. Axios - Http request tool
5. @types/node - Typescript node support
7. Moment.Js - For validation time and dates

Backend is using 3000/tcp port as http by default.

## Frontend
### Using libraries
1. React - Framework for ui
2. Vite - Creation tool
3. Axios - Http request tool
4. echarts - Graph/Charts visualizer
5. react-echarts-library - chart visualizer for react

Frontend is using 8085/tcp port as https by default.
Before using data chart visualization, price sync is needed to handle data from Elering API to backend.

## How to run
If you cloned it without node_modules, run `install.ps1` file to install every dependency. P.S. Right click on file, select `Run with Powershell`.
| Or go to backend folder, open terminal and write `npm i`, same with frontend folder.
1. Download or open existing main folder
2. Run `migrate_backend.bat` to run database collection creating.
| Or run by yourself command in backend folder `npm run migrate`.
3. Run `run_backend.bat` to run backend
| Or manually open backend folder, there terminal and run `npm run start`.
4. Run `run_frontend.bat` to run frontend
| Or manually open frontend folder, there terminal and run `npx vite --port 8085`
5. Visit http://127.0.0.1:8085/ website

## API Backend endpoints
1. GET /api/health<br>
Returns status of server
```
{
    "status": "ok" | "bad",
    "db": "ok" | "bad"
}
```

2. POST /api/import/json<br>
Importing new data of electricity prices<br>
Request body( **may be one object or array of objects** ):
```
{
    timestamp: string, // Time in ISO-8601 format
    location: string,
    price_eur_mwh: number // Price in euro per 1 MegaWattHour 
}
```
3. GET /api/readings<br>
Getting electricity prices by filter<br>
Required query parameters:
    * start - Start time to slice in UNIX timestamp ISO 8601
    * end - End time to slice in UNIX timestamp ISO 8601
    * location - Price locations. **ONLY Available: EE, LV, FI**<br>
Returns array of time frames
```
{
    timestamp: string, // ISO 8601
    location: string,
    price_eur_mwh: number,
    id: number,
    source: string, // 'UPLOAD' or 'API'
    created_at: string // ISO 8601 format
}[]
```
4. POST /api/sync/prices<br>
Update price list from Elering API<br>
Required query parameters:
    * start - Start time to slice in UNIX timestamp ISO 8601
    * end - End time to slice in UNIX timestamp ISO 8601
    * location - Price locations. **ONLY Available: EE, LV, FI**<br>
Returns 200 if ok



**Backend may return not 200 status code in error situations. So look not only into browser renderer but in response as code and data**


# Contacts
## Noormeister 2026
Ida-Virumaa Kutsehariduskeskus Tarvaraarendaja 4 kursus<br>
Vladislav Šišelov.<br>
vladislav.shishelov@gmail.com<br>