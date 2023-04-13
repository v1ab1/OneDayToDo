import { useState } from "react";
import axios from 'axios';
import { URL } from "../../BASE_URL";
import { CheckMark, Cancel, Cross } from "../SVGs";
import styles from "./Card.module.css";

export const Card = ({ placeholder, color, done, index, data, setData, isLocal }) => {
  const [isDone, setIsDone] = useState(done);

  const remove = () => {
    const indexInData = data.findIndex(obj => obj.hasOwnProperty('index') && obj.index === index);
    const newData = data.filter(el =>
      el.index !== index
    );
    setData(newData);
    isLocal ?
    localStorage.setItem("storage", JSON.stringify(newData))
    :
    axios.delete(`${URL}?id=${indexInData}`)
    .catch(error => {
      console.error(error);
    });
  };

  const handleDone = () => {
    setIsDone(!isDone);
    const newData = [...data];
    const indexInData = newData.findIndex(obj => obj.hasOwnProperty('index') && obj.index === index);
    newData[indexInData].done = !newData[indexInData].done;
    setData(newData);
    isLocal ? 
    localStorage.setItem("storage", JSON.stringify(newData))
    :
    axios.patch(`${URL}`, {
    index: indexInData
    })
    .catch(error => {
      console.error(error);
    });
  };

  return (
    <div className={styles.card} style={isDone ? {backgroundColor: "#a3ffa3", borderColor: "green"} : {borderColor: color}}>
      <input value={placeholder} type="text" className={styles.input} readOnly />
      <button onClick={() => handleDone()}>
        {isDone ? <Cancel style={{scale: 1.3}} /> : <CheckMark />}
      </button>
      <button onClick={() => remove()}>
        <Cross />
      </button>
    </div>
  );
};