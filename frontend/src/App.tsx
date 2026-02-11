import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
  const [health, setHealth] = useState<boolean>(false);

  useEffect(() => {
    axios.get("http://127.0.0.1:3000/health").then(x => {
      if(x.status == 200){
        const data = x.data as {status: "ok" | "bad", db: "ok" | "bad"};
        if(data && data.db == "ok" && data.status == "ok")
          setHealth(true);
      }
    }).catch(console.log);
  }, []);

  return <div>
    <div style={{display: 'flex'}}>
      <span>Backend {health ? "OK" : "connection is timeout. Check if it working or not.\nFull error log you can see in browser console"}</span>
    </div>
  </div>
}

export default App
