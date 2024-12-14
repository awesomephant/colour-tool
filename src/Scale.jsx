import Swatch from "./Swatch";

function Scale(props) {
  const swatches = props.scale.colours.map((c, i) => (
    <li key={`${props.scale.id}-swatch-${i}`}>
      <Swatch id={i} colour={c}></Swatch>
    </li>
  ));

  return (
    <div className="scale">
      <ul className="scale__swatches">{swatches}</ul>
    </div>
  );
}

export default Scale;
