import { useState } from "react"
import "./App.css"
import Graph from "./Graph"
import Scale from "./Scale"

function App() {
  const [scales, setScales] = useState([{ id: "scale1", colours: [] }])
  const currentScale = 0

  const scaleElements = scales.map((s) => {
    return <Scale key={s.id} scale={s}></Scale>
  })

  function addSwatch(colour, index) {
    // Let's say you can only add to the current scale
    let newColours = [...scales[currentScale].colours]
    let newScales = [...scales]
    newColours.splice(index, 0, colour)
    newScales[currentScale].colours = newColours

    setScales(newScales)
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>MKVC Colour Tool</h1>
      </header>
      <main className="app__body">
        <section className="scales">{scaleElements}</section>
        <Graph addSwatch={addSwatch} scales={scales} hue={160}></Graph>
      </main>
    </div>
  )
}

export default App
