import * as axios from 'axios'; 

const tryGetData = (start: string, end: string) => axios.get(`http://127.0.0.1:3000/api/readings?start=${start}&end=${end}&location=ee`, {
    validateStatus: status => (status >= 200 && status < 300) || status === 500 || status == 400
});

test(`Api test for date validation input`, async () => {
    const timestamps: string[] =
    [
        "111",
        "AAA"
    ];
    const res = await tryGetData(timestamps[0], timestamps[1]);
    expect(res.data).toBe("Bad request. Start and end date must be in ISO 8601 format!");
});