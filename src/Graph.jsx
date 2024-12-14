import { useEffect, useRef, useState } from "react"
import utils from "./utils"
import { Hsluv } from "hsluv"

function renderGraph(el, hue) {
  const c = el.getContext("2d")
  const w = c.canvas.width
  const h = c.canvas.height

  const rw = w
  const rh = h

  const conv = new Hsluv()
  let data = []

  for (let i = 0; i < rw * rh; i++) {
    const lightness = 100 * ((i % rw) / rw)
    const saturation = 100 - 100 * (Math.floor(i / rw) / rh) // [0,100]
    conv.hsluv_h = hue
    conv.hsluv_s = saturation
    conv.hsluv_l = lightness
    conv.hsluvToRgb()
    data.push(Math.round(conv.rgb_r * 255), Math.round(conv.rgb_g * 255), Math.round(conv.rgb_b * 255), 255)
  }

  const clampedData = Uint8ClampedArray.from(data)
  const id = new ImageData(clampedData, Math.floor(rw))
  c.putImageData(id, 0, 0)
}

function Graph({ hue, ...props }) {
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
    const h = hue
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
    renderGraph(canvasRef.current, hue)
    setCanvas({ width: cr.width, height: cr.height })
  }, [hue])

  const points = scale.colours.map((p, i) => {
    const [h, s, l] = p
    return { x: l * canvas.width, y: canvas.height - s * canvas.height, index: i, colour: p }
  })

  const markers = points.map((p) => {
    const r = 11
    let bc = "black"
    if (p.colour[2] < 0.5) {
      bc = "white"
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
