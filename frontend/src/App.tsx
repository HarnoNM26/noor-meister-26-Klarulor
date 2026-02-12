import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';
import { EleringSynchronizationComponent } from './components/EleringSynchronizationComponent';
import { backend_base_url } from './main';
import { EleringDatVisualizationComponent } from './components/EleringDatVisualizationComponent';
import { DataDeletingComponent } from './components/DataDeletingComponent';
import { Insights } from './components/Insights';

function App() {
  const [health, setHealth] = useState<boolean>(false);
  const [problemText, setProblemText] = useState<string>("Waiting for connection..");

  useEffect(() => {
    axios.get(`${backend_base_url}/api/health`).then(x => {
      if(x.status == 200){
        const data = x.data as {status: "ok" | "bad", db: "ok" | "bad"};
        if(data && data.db == "ok" && data.status == "ok")
          setHealth(true);
        else{
          const msg = data.db == "bad" ? "Database problem. Check database connection or migration" : "Backend problem. Check is it running now?";
          setProblemText(msg);
        }
        
      }
    }).catch(err => {
      console.log(err);
      setProblemText("Try check backend. Is it running?")
    });
  }, []);

  return <div>
    <div>
      <span>Backend {health ? "OK" : problemText}</span>
      <EleringSynchronizationComponent></EleringSynchronizationComponent>
      <hr></hr>
      <DataDeletingComponent></DataDeletingComponent>
      <hr></hr>
      <p>Insights</p>
      <Insights></Insights>
      <hr></hr>
      <p>Data visualization</p>
      <EleringDatVisualizationComponent></EleringDatVisualizationComponent>
    </div>
  </div>
}

export default App
