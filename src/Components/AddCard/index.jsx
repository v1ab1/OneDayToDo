import { useState, useEffect } from "react";
import axios from 'axios';
import { URL } from "../../BASE_URL";
import { Colors } from "./Colors";
import { Plus } from "../SVGs";
import styles from "./AddCard.module.css";

export const AddCard = ({ data, setData, isLocal }) => {
  const [inputState, setInputState] = useState('');
  const [isColorSelection, setColorSelection] = useState(false);
  const [color, setColor] = useState("red");

  useEffect(() => {
    const local = localStorage.getItem('color');
    local ? setColor(local) : setColor('red');
  }, []);
  

  const handleInputChange = (event) => {
    setInputState(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      save();
    }
  };

  const save = () => {
    const index = Math.floor(Math.random() * Number.MAX_VALUE);
    const newItem = {
      placeholder: inputState,
      color: color,
      done: false,
      index: index,
    };

    const newData = data ? [...data, newItem] : [newItem];

    setInputState("");

    setData(newData);
    isLocal ? 
    localStorage.setItem("storage", JSON.stringify(newData))
    :
    axios.post(URL, newItem)
    .catch(error => {
      console.error(error);
    });
  };


  return (
    <div className={styles.add}>
      {isColorSelection ? <Colors setColor={setColor} setColorSelection={setColorSelection} />
      :
      <>
        <input placeholder="Новая задача" type="text" value={inputState} onChange={handleInputChange} className={styles.input} onKeyDown={handleKeyDown} />
        <button onClick={() => setColorSelection(true)}>
          <div className={styles.color} style={{backgroundColor: color}} />
        </button>
        <button onClick={() => save()}>
          <Plus />
        </button>
      </>
      }
    </div>
  );
};
