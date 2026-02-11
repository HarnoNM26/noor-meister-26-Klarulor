import { MongoConnector } from "./connectors/MongoConnector";

import * as express from 'express';
import {json} from 'express';
import { setupEndpoints } from "./controllers/mainController";
const cors = require(`cors`);

(async () => {
    console.log(`Initializing`);

    const app = express();

    app.use(json());
    app.use(cors("*")); 

    if(await MongoConnector.connect()){
        if(process.argv.find(x => x.includes("migrate"))){
            await MongoConnector.migrate();
            console.log(`Successfully migrated. Now you can run program via "npm run" start`);
            return;
        }
        if(!await MongoConnector.checkHealth()){
            console.log(`Migration needed. Run migration via command 'npm run migrate'`);
            return;
        }
    }

    setupEndpoints(app);

    app.listen(3000, () => console.log(`App is successfully listening to 3000 port`));
})();