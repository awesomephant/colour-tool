import utils from "./utils";

function Swatch(props) {
  let color = "black";
  if (props.colour[2] < 0.6) {
    color = "white";
  }
  const css = {
    backgroundColor: `${utils.HSLToString(props.colour)}`,
    color: color,
  };
  return (
    <div className="swatch" style={css}>
      {props.id * 10}
    </div>
  );
}

export default Swatch;
