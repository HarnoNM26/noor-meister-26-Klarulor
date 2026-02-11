import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
  const [health, setHealth] = useState<boolean>(false);
  const [problemText, setProblemText] = useState<string>("Waiting for connection..");

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/api/health").then(x => {
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
    <div style={{display: 'flex'}}>
      <span>Backend {health ? "OK" : problemText}</span>
    </div>
  </div>
}

export default App
