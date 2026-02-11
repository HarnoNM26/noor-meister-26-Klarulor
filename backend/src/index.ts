import { MongoConnector } from "./MongoConnector";

import * as express from 'express';

(async () => {
    console.log(`Initializing`);

    const app = express();
    app.listen(3000, () => console.log(`App is successfully listening to 3000 port`));

    MongoConnector.connect();
})();