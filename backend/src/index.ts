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

    await MongoConnector.connect();

    setupEndpoints(app);
    app.listen(3000, () => console.log(`App is successfully listening to 3000 port`));
})();