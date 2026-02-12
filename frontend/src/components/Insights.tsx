import { useEffect, useState } from "react";
import { backend_base_url } from "../main";
import axios, { all } from "axios";

type GetInsightsResponseType = {
    average_price: number;
    min_price: number;
    max_price: number;
    cheapest_slots: {price: number, date: number}[];
    most_expensive_slots: {price: number, date: number}[];
}

export function Insights(){
    const [selectedLocation, setSelectedLocation] = useState<string>("EE");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const [data, setData] = useState<GetInsightsResponseType | null>(null);
    const [cheapesSlotsHumanFormat, setCheapesSlotsHumanFormat] = useState<string[]>([]);
    const [expensiveSlotsHumanFormat, setExpensiveSlotsHumanFormat] = useState<string[]>([]);

    function tryRequestData(){
        if(selectedLocation == "" || startDate == "" || endDate == "")
                return;

        const startDateObject = new Date(startDate);
        const endDateObject = new Date(endDate);
        if(startDateObject.getTime() > endDateObject.getTime()){
            setData(null);
            return;
        }
        const startParam = startDateObject.toISOString();
        const endParam = endDateObject.toISOString();
        axios.get(`${backend_base_url}/api/insights/prices?start=${startParam}&end=${endParam}&location=${selectedLocation}`).then(x => {
            const newData = x.data as GetInsightsResponseType;
            setData(newData);
            setCheapesSlotsHumanFormat(newData.cheapest_slots.map(x => {
                const date = new Date(x.date);
                return `${date.getFullYear()}.${date.getMonth()}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - ${x.price} Eur/MWh`;
            }));
            setExpensiveSlotsHumanFormat(newData.most_expensive_slots.map(x => {
                const date = new Date(x.date);
                return `${date.getFullYear()}.${date.getMonth()}.${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} - ${x.price} Eur/MWh`;
            }));
        }).catch(() => {
            setData(null);
        });
    }

    useEffect(() => {
        tryRequestData();
    }, [selectedLocation, startDate, endDate])

    return <div>
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
        <div>
            {data == null ? (
                endDate == "" || startDate == "" ? <p>Select fields to visualize data. </p> : (
                    new Date(endDate).getTime() < new Date(startDate).getTime() ? <p>End date must be greater that start date</p> : <p>No data for that location and period</p>
            )
            ) : <div>
                <span>
                    Average price for selected period: {data.average_price} Eur/MWh<br></br>
                    Minimum price for selected period: {data.min_price} Eur/MWh<br></br>
                    Maximum price for selected period: {data.max_price} Eur/MWh<br></br>
                    
                    Cheapest slots for selected period are: <br></br>{cheapesSlotsHumanFormat.map(x => <p key={x}> - {x}</p>)}<br></br>
                    Expensive slots for selected period are: <br></br>{expensiveSlotsHumanFormat.map(x => <p key={x}>- {x}</p>)}<br></br>
                </span>
                </div>}
        </div>
    </div>
}