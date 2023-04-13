import { useState, useEffect } from "react";
import axios from 'axios';
import { Card } from "./Components/Card";
import { AddCard } from "./Components/AddCard";
import { Local, Web, Cancel } from "./Components/SVGs";
import { URL } from "./BASE_URL";
import "./main.css";

export const App = () => {
  const [data, setData] = useState([]);
  const [isLocal, setLocal] = useState(true);

  useEffect(() => {
    const storage = localStorage.getItem('local');
    storage ? setLocal(true) : setLocal(false);
    isLocal ? setData(JSON.parse(localStorage.getItem('storage'))) :
    axios.get(URL)
    .then(response => {
      setData(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }, [isLocal]);
  
  const handleStorage = () => {
    isLocal ? localStorage.removeItem('local') : localStorage.setItem('local', 'true');
    setLocal(!isLocal);
  };

  const clearAll = () => {
    if (isLocal) {
      localStorage.clear();
      setData([]);
    } else {
      axios.delete(`${URL}all`)
      .catch(error => {
        console.error(error);
      });
      setData([]);
    }
  };
  
  return (
    <>
      <div className="App">
        <div className="wrapper">
          <button className="clear" onClick={() => clearAll()}>
            <Cancel />
          </button>
          <button className="local" onClick={() => handleStorage()}>
            {isLocal ? <Local /> : <Web />}
          </button>
          {data ? data.map(el => (
            <Card 
              placeholder={el.placeholder}
              color={el.color}
              done={el.done}
              index={el.index}
              data={data}
              setData={setData}
              isLocal={isLocal}
              key={el.index}
            />
          )) : null}
          <AddCard data={data} setData={setData} isLocal={isLocal} />
        </div>
      </div>
    </>
  );
};
