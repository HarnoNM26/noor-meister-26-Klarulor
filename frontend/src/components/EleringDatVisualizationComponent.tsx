import { useEffect, useState } from "react";
import type { EnergyReading } from "../interfaces/EnergyReading";
import axios, { all } from "axios";
import { backend_base_url } from "../main";
import EChartsReact from 'react-echarts-library';
import type { EChartsOption } from 'echarts';

export function EleringDatVisualizationComponent(){
    const [selectedLocation, setSelectedLocation] = useState<string>("EE");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [data, setData] = useState<EnergyReading[]>([]);
    let [allData, setAllData] = useState<{[location: string]: EnergyReading[]}>({});
    const locations = ["EE", "LV", "FI"];

    function tryRequestData(){
        try{
            if(selectedLocation == "" || startDate == "" || endDate == "")
                return;

             const startDateObject = new Date(startDate);
            const endDateObject = new Date(endDate);
            const startParam = startDateObject.toISOString();
            const endParam = endDateObject.toISOString();

            axios.get(`${backend_base_url}/api/readings?start=${startParam}&end=${endParam}&location=${selectedLocation}`).then(x => {
                setData(x.data as EnergyReading[]);
            }).catch(() => {
                setData([]);
            });

            for(const loc of locations){
                axios.get(`${backend_base_url}/api/readings?start=${startParam}&end=${endParam}&location=${loc}`).then(x => {
                    const newObj: any = {};
                    for(const k in allData){
                        newObj[k] = allData[k];
                    }

                    newObj[loc] = x.data;
                    setAllData(newObj);
                    allData = newObj;
                }).catch(() => {
                    setAllData({});
                });
            }
        }catch(err){
            alert(`Cant handle response from server and recycle it. Check console for more details`);
        }
    }

    useEffect(() => {
        tryRequestData();
    }, [selectedLocation, startDate, endDate])

    try{
        const count = 100;
        const offset = Math.round(data.length/20);
        const x: string[] = [];
        const y: number[] = [];

        for(let i = 0; i < data.length; i++){
            if(i % offset == 0 || true){
                const e = data[i];
                const date = new Date(e.timestamp);
                x.push(e.timestamp);
                y.push(+(e.price_eur_mwh ?? 0)?.toFixed(2) );
            }
        }

        const dailyAverageOptionsX: string[] = [];
        const dailyAverageOptionsY: number[] = [];

        for(const e of data.filter(z => z.timestamp.includes("00:00:00"))){
            const d =e.timestamp.split('T')[0];
            const same = data.filter(z => z.timestamp.startsWith(d));
            let average = 0;
            for(const n of same){
                average += +(e.price_eur_mwh ?? 0)?.toFixed(2);
            }
            average /= same.length;
            average = +average.toFixed(2)
            dailyAverageOptionsX.push(d);
            dailyAverageOptionsY.push(+(e.price_eur_mwh ?? 0)?.toFixed(2) );
        }

        const option: EChartsOption = {
            title: {
              text: 'Price over time',
              left: 'center'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['Sales', 'Expenses'],
              bottom: 'bottom'
            },
            xAxis: {
              name: "time",
              type: 'category',
              data: x,
              min: (x?.length ?? 0)-200
            },
            yAxis: {
              type: 'value',
              name: 'Eur/MWh'
            },
            series: [
              {
                name: `${selectedLocation} Eur/MWh`,
                type: 'line',
                data: y
              },
            ]
        };
        const dailyAverageOptions: EChartsOption = {
            title: {
              text: 'Average Price per selected location',
              left: 'center'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['Sales', 'Expenses'],
              bottom: 'bottom'
            },
            xAxis: {
              name: "time",
              type: 'category',
              data: dailyAverageOptionsX,
              max: dailyAverageOptionsX?.length ?? 100
            },
            yAxis: {
              type: 'value',
              name: 'Eur/MWh'
            },
            series: [
              {
                name: `${selectedLocation} Eur/MWh`,
                type: 'line',
                data: dailyAverageOptionsY
              },
            ]
        };

        let selectedLocationPercent = 0;
        let averagePrice = 0;
        for(const x of data){
            averagePrice += x.price_eur_mwh ?? 0;
        }
        averagePrice /= data.length;
        averagePrice = +averagePrice.toFixed(2);
        selectedLocationPercent = 100;


        const allDailyAverageOptionsX: string[] = [];
        const allDailyAverageOptionsYs: number[][] = [[], [], []];

        let ii = 0;
        try{
            if(allData && Object.keys(allData).length == 3){
                for(const loc of locations){
                    for(const e of allData[loc].filter(z => z.timestamp.includes("00:00:00"))){
                        const d =e.timestamp.split('T')[0];
                        const same = allData[loc].filter(z => z.timestamp.startsWith(d));
                        let average = 0;
                        for(const n of same){
                            average += +(e.price_eur_mwh ?? 0)?.toFixed(2);
                        }
                        average /= same.length;
                        average = +average.toFixed(2)
                        if(loc == "EE"){
                            allDailyAverageOptionsX.push(d);
                        }
                        allDailyAverageOptionsYs[ii].push(+(e.price_eur_mwh ?? 0)?.toFixed(2) );
                    }
                ii++;
            }
            }

        }catch(err){
            alert('No data for visualizing average prices per location');
        }


        const averagePricePerLocationOption: EChartsOption = {
            title: {
              text: 'Daily average price in selected date range',
              left: 'center'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['Sales', 'Expenses'],
              bottom: 'bottom'
            },
            xAxis: {
              name: "time",
              type: 'category',
              data: allDailyAverageOptionsX,
            },
            yAxis: {
              type: 'value',
              name: 'Eur/MWh'
            },
            series: [
              {
                name: 'EE Eur/MWh',
                type: 'line',
                data: allDailyAverageOptionsYs[0]
              },
              {
                name: 'LV Eur/MWh',
                type: 'line',
                data: allDailyAverageOptionsYs[1]
              },
              {
                name: 'FI Eur/MWh',
                type: 'line',
                data: allDailyAverageOptionsYs[2]
              },
            ]
        };





        const allDataXs: string[] = [];
        const allDataYs: number[][] = [[],[],[],[]];


        try{
            if(allData && Object.keys(allData).length == 3){
                for(let ii = 0; ii < 3; ii++){
                    const loc = locations[ii];
                    if(!allData[loc])
                        continue;
                    for(let i = 0; i < allData[loc].length; i++){
                        if(i % offset == 0 || true){
                            const e = allData[loc][i];
                            const date = new Date(e.timestamp);
                            // if(allDataXs.includes(e.timestamp))
                            //     allDataXs.push(e.timestamp);
                            if(ii == 0){
                                allDataXs.push(date.toISOString());
                            }
                            allDataYs[ii].push(+(e.price_eur_mwh ?? 0)?.toFixed(2) );
                        }
                    }   
                }
            }
        }catch(err){
            alert("Cant render compare price chart, no valid data provided");
        }

        const compareOption: EChartsOption = {
            title: {
              text: 'Compare price chart per location',
              left: 'center'
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: ['Sales', 'Expenses'],
              bottom: 'bottom'
            },
            xAxis: {
              name: "time",
              type: 'category',
              data: allDataXs
            },
            yAxis: {
              type: 'value',
              name: 'Eur/MWh'
            },
            series: [
              {
                name: 'EE Eur/MWh',
                type: 'line',
                data: allDataYs[0]
              },
              {
                name: 'LV Eur/MWh',
                type: 'line',
                data: allDataYs[1]
              },
              {
                name: 'FI Eur/MWh',
                type: 'line',
                data: allDataYs[2]
              },
            ]
        };



        return <div style={{display: 'grid'}}>
            <div style={{display: 'grid'}}>
                <span>Selectors: </span>
                <span>Start date: <input className="input" type="datetime-local" style={{maxWidth:100}}  onChange={d => {
                    setStartDate(d.target.value);
                }}></input></span>
                <span style={{marginTop: 5}}>End date: <input className="input" type="datetime-local" style={{maxWidth:100, marginLeft: 5}} onChange={d => {
                    setEndDate(d.target.value);
                }}></input></span>
                <span>Location: <select onChange={s => {
                    const value = s.target.options[s.target.selectedIndex].value; 
                    setSelectedLocation(value);
                }}>
                    <option value="EE">EE</option>
                    <option value="LV">LV</option>
                    <option value="FI">FI</option></select></span>    
            </div>
            {data.length > 0 ? <div>
                <EChartsReact option={option} style={{ height: '400px', width: '100%' }} />
                <EChartsReact option={dailyAverageOptions} style={{ height: '400px', width: '100%' }} />
                <EChartsReact option={averagePricePerLocationOption} style={{ height: '400px', width: '100%' }} />
                <EChartsReact option={compareOption} style={{ height: '400px', width: '100%' }} />
            </div> : (
                endDate == "" || startDate == "" ? <><p>Select fields to visualize data. </p><p>If you need to see average per day, select next day too!</p></> : <p>No data for that location and period</p>
            )}
        </div>
        
    }catch(err){
        console.log(err);
    }
    return <div>
        <p>
            Error while visualizing the data, check console for more details or try to select other data!
        </p>
    </div>
}