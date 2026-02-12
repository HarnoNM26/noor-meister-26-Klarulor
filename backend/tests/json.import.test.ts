import * as j from "jest";
import { EnergyReading } from "../src/schems/EnergyReading";
import { PostEnergyReadingDto } from "../src/dto/post.data.dto";
import { JsonImpoerServiceHandleRequestReturnType } from "../src/services/JsonImportService";
import * as axios from 'axios';


const tryUploadData = (payload: PostEnergyReadingDto | PostEnergyReadingDto[]) => axios.post("http://127.0.0.1:3000/api/import/json", payload);
test("JSON Import test on invalid timestamp", async () => {
    const date = new Date(Date.now())
    const payloads = [{
        timestamp: '2026-01-11T12:06:28.502Z-AAAZZ',
        location: "lv",
        price_eur_mwh: 7777
    }];
    const result1 = await tryUploadData(payloads[0]);
    const data1 = result1.data as JsonImpoerServiceHandleRequestReturnType;
    expect(data1.success).toBe(true);
    expect(data1.successResponse.skipped).toBe(1);
    
});

test("JSON Import test on duplicates", async () => {
    const date = new Date(Date.now())
    const payloads = [{
        timestamp: date.toISOString(),
        location: "ee",
        price_eur_mwh: 1
    },
    {
        timestamp: date.toISOString(),
        location: "ee",
        price_eur_mwh: 1
    }];

    const result2 = await tryUploadData(payloads);
    const data2 = result2.data as JsonImpoerServiceHandleRequestReturnType;
    expect(data2.success).toBe(true);
    expect(data2.successResponse.duplicatesDetected).toBe(1);
    
});

