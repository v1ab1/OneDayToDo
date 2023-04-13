import styles from "./Colors.module.css";

export const Colors = ({ setColor, setColorSelection }) => {
  const colors = ["red", "blue", "green", "yellow", "purple", "black", "gray"];

  const handleClick = (color) => {
    setColor(color);
    setColorSelection(false);
    localStorage.setItem("color", color);
  };

  return (
    <div className={styles.Colors}>
      {colors.map(color => (
        <button className={color} onClickCapture={() => handleClick(`${color}`)} />
      ))}
    </div>
  )
};