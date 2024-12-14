import { useEffect, useRef, useState } from "react"
import utils from "./utils"

function renderGraph(el) {
  const c = el.getContext("2d")
  const cw = c.canvas.width
  const ch = c.canvas.height
  const h = 20

  let data = []

  let sn = 0
  let ln = 0
  for (let i = 0; i < ch; i++) {
    for (let j = 0; j < cw; j++) {
      sn = 1 - (1 / ch) * i
      ln = (1 / cw) * j
      let rgba = utils.HSLToRGBA([h, sn, ln])
      data.push(...rgba)
    }
  }

  const clampedData = Uint8ClampedArray.from(data)
  const id = new ImageData(clampedData, cw)

  c.putImageData(id, 0, 0)

  const spacing = 48
  const rowCount = Math.ceil(ch / spacing)
  const columnCount = Math.ceil(cw / spacing)
  const r = 0
  const w = 0.5

  for (let i = 0; i < columnCount; i++) {
    for (let j = 0; j < rowCount; j++) {
      let x = (cw / columnCount) * i + spacing / 2
      let y = (ch / rowCount) * j + spacing / 2
      c.fillStyle = "black"
      // horizontal
      // c.fillRect(x - r / 2, y - w / 2, r, w);
      // vertical
      // c.fillRect(x - w / 2, y - r / 2, w, r);
      let v = 255 - (cw / 255) * i
      c.fillStyle = `rgb(${v},${v},${v})`
      if (i < columnCount / 2) {
      }
      c.fillRect(x - r / 2, y - r / 2, r, r)
    }
  }
}

function Graph(props) {
  const canvasRef = useRef()
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [canvas, setCanvas] = useState({ width: 0, height: 0 })
  const scale = props.scales[0]

  function handleMouseMove(e) {
    const target = e.target.getBoundingClientRect()
    const x = e.clientX - target.x
    const y = e.clientY - target.y
    setMouse({ x: x, y: y })
  }

  function handleClick(e) {
    e.preventDefault()
    const target = e.target.getBoundingClientRect()
    const x = e.clientX - target.x
    const y = e.clientY - target.y
    const h = 20
    const s = 1 - y / target.height
    const l = x / target.width

    let index = 0

    for (let i = 0; i < scale.colours.length; i++) {
      let ci = scale.colours[i]
      if (l > ci[2]) {
        index = i + 1
      }
    }
    console.log(`Adding colour at ${index}`)
    props.addSwatch([h, s, l], index)
  }

  useEffect(() => {
    const cr = canvasRef.current.getBoundingClientRect()
    canvasRef.current.width = cr.width
    canvasRef.current.height = cr.height
    renderGraph(canvasRef.current, scale)
    setCanvas({ width: cr.width, height: cr.height })
  }, [])

  const points = scale.colours.map((p, i) => {
    const [h, s, l] = p
    return { x: l * canvas.width, y: canvas.height - s * canvas.height, index: i, colour: p }
  })

  const markers = points.map((p) => {
    const r = 11
    let bc = "black"
    if (p.colour[2] < 0.5) {
      bc = "white"
    } else {
    }
    const css = {
      width: `${r}px`,
      background: utils.HSLToString(p.colour),
      height: `${r}px`,
      border: `1px solid ${bc}`,
      transform: `translateX(${p.x - r / 2 - 1}px) translateY(${p.y - r / 2 - 1}px)`,
    }
    return <span key={`point-${p.x}-${p.y}`} style={css} className="graph__point"></span>
  })

  return (
    <section className="graph">
      <canvas onClick={handleClick} onMouseMove={handleMouseMove} className="graph__canvas" ref={canvasRef}></canvas>
      {markers}
      <svg shapeRendering="crisp-edges" className="graph__vectors">
        <polyline
          points={points
            .map((p) => {
              return `${p.x}, ${p.y}`
            })
            .join(" ")}
        ></polyline>
      </svg>
    </section>
  )
}

export default Graph
