import axios from "axios";
import { useState } from "react"
import { backend_base_url } from "../main";

export function EleringSynchronizationComponent(){
    const [selectedLocation, setSelectedLocation] = useState<string>("");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [isWorking, setIsWorking] = useState<boolean>(false);

    function syncPrices(){
        try{
            const startDateObject = new Date(startDate);
            const endDateObject = new Date(endDate);
            const startParam = startDateObject.toISOString();
            const endParam = endDateObject.toISOString();
            
             if(!startDateObject || !endDateObject || !startParam || !startDate || !endParam || !endDate || (startDateObject.getTime() > endDateObject.getTime())){
                alert("Bad data selected!");
                return;
            }

            setIsWorking(true);
            axios.post(`${backend_base_url}/api/sync/prices?start=${startParam}&end=${endParam}&location=${selectedLocation}`).then(x => {
                alert(`Database successfully was updated for price lists`);
            }).catch(err => {
                alert(`Happened error. ${err.status == 400 ?  'Check server for console errors' : "Check your backend and your connection"} `);
            }).finally(() => {
                setIsWorking(false);
            });
            

        }catch(err){
             alert("Bad data selected!");
             return;
        }

        
    }

    return <div>
        <div style={{display: 'grid'}}>
            <span>Selectors: </span>
            <span>Start date: <input type="datetime-local" style={{maxWidth:100}} onChange={d => {
                setStartDate(d.target.value);
            }}></input></span>
            <span>End date: <input type="datetime-local" style={{maxWidth:100}} onChange={d => {
                setEndDate(d.target.value);
            }}></input></span>
            <span>Location: <select onChange={s => {
                const value = s.target.options[s.target.selectedIndex].value; 
                setSelectedLocation(value);
            }}>
                <option value="EE">EE</option>
                <option value="LV">LV</option>
                <option value="FI">FI</option></select></span>

                <button style={{backgroundColor: "#B8F5DA"}} disabled={isWorking} onClick={syncPrices}>Sync prices</button>
        </div>
    </div>
}