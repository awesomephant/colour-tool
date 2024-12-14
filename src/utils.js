function HexToRGBA(hex) {
  var m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i)
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16), 255]
}

function scaleRGB(rgb) {
  const [r, g, b] = [...rgb]
  return [r / 255, g / 255, b / 255]
}

function RGBAToHSL(rgb) {
  let scaled = scaleRGB(rgb)
  const [r, g, b] = scaled
  const max = Math.max(...scaled)
  const min = Math.min(...scaled)
  const v = scaled.indexOf(max)
  const c = max - min
  const l = (max - min) / 2
  let h
  let s

  if (c === 0) {
    h = 0 // gray
  } else {
    switch (max) {
      case r:
        h = 60 * ((g - b) / c)
        break
      case g:
        h = 60 * (2 + (b - r) / c)
        break
      case b:
        h = 60 * (4 + (r - g) / c)
        break
    }
  }

  if (l === 0 || l === 1) {
    s = 0
  } else {
    s = (-1 * c) / (1 - Math.abs(2 * v - c - 1))
  }
  //   console.log(`R=${r}, max=${max} C=${c}, h=${h}, v=${v}m l=${l}`);

  return [h, s, l]
}

function HSLToRGBA(hsl) {
  // h = [0,360]; s = [0,1], l = [0,1]
  const [h, s, l] = hsl
  const c = (1 - Math.abs(2 * l - 1)) * s
  const m = l - c / 2
  const hp = h / 60
  let rgba = [0, 0, 0, 0]
  const scale = 255
  const x = c * (1 - Math.abs((hp % 2) - 1))
  if (hp >= 0 && hp < 1) {
    rgba = [c + m, x + m, 0 + m, 1]
  }
  if (hp >= 1 && hp < 2) {
    rgba = [x + m, c + m, 0 + m, 1]
  }
  if (hp >= 2 && hp < 3) {
    rgba = [0 + m, c + m, x + m, 1]
  }
  if (hp >= 3 && hp < 4) {
    rgba = [0 + m, x + m, c + m, 1]
  }
  if (hp >= 4 && hp < 5) {
    rgba = [x + m, 0 + m, c + m, 1]
  }
  if (hp >= 5 && hp < 6) {
    rgba = [c + m, 0 + m, x + m, 1]
  }

  rgba.forEach((n, i) => {
    rgba[i] = n * scale
  })
  return rgba
}

function HSLToString(hsl) {
  const [h, s, l] = hsl
  const result = `hsl(${h}, ${s * 100}%, ${l * 100}%)`
  return result
}

export default { HexToRGBA, scaleRGB, RGBAToHSL, HSLToRGBA, HSLToString }
