
/* eslint-disable */

/**

combine(
  // rotate about center at 100, 100
  rotate(15, 100, 100),

  // move 100 to left the 100 down
  translate(100, 0, 0),
  translate(0, 100, 0),

  // rotate about center at 200, 200
  rotate(15, 200, 200)

  // scale about center at 200, 200
  scale(0.5, 200, 200)
)

*/

const cos = Math.cos.bind(Math)
const sin = Math.sin.bind(Math)

const multiply = (a, b) => {
  const m = new Float32Array(16)

  m[ 0] = b[ 0] * a[0] + b[ 1] * a[4] + b[ 2] * a[ 8] + b[ 3] * a[12]
  m[ 1] = b[ 0] * a[1] + b[ 1] * a[5] + b[ 2] * a[ 9] + b[ 3] * a[13]
  m[ 2] = b[ 0] * a[2] + b[ 1] * a[6] + b[ 2] * a[10] + b[ 3] * a[14]
  m[ 3] = b[ 0] * a[3] + b[ 1] * a[7] + b[ 2] * a[11] + b[ 3] * a[15]

  m[ 4] = b[ 4] * a[0] + b[ 5] * a[4] + b[ 6] * a[ 8] + b[ 7] * a[12]
  m[ 5] = b[ 4] * a[1] + b[ 5] * a[5] + b[ 6] * a[ 9] + b[ 7] * a[13]
  m[ 6] = b[ 4] * a[2] + b[ 5] * a[6] + b[ 6] * a[10] + b[ 7] * a[14]
  m[ 7] = b[ 4] * a[3] + b[ 5] * a[7] + b[ 6] * a[11] + b[ 7] * a[15]

  m[ 8] = b[ 8] * a[0] + b[ 9] * a[4] + b[10] * a[ 8] + b[11] * a[12]
  m[ 9] = b[ 8] * a[1] + b[ 9] * a[5] + b[10] * a[ 9] + b[11] * a[13]
  m[10] = b[ 8] * a[2] + b[ 9] * a[6] + b[10] * a[10] + b[11] * a[14]
  m[11] = b[ 8] * a[3] + b[ 9] * a[7] + b[10] * a[11] + b[11] * a[15]

  m[12] = b[12] * a[0] + b[13] * a[4] + b[14] * a[ 8] + b[15] * a[12]
  m[13] = b[12] * a[1] + b[13] * a[5] + b[14] * a[ 9] + b[15] * a[13]
  m[14] = b[12] * a[2] + b[13] * a[6] + b[14] * a[10] + b[15] * a[14]
  m[15] = b[12] * a[3] + b[13] * a[7] + b[14] * a[11] + b[15] * a[15]

  return m
}

const rotate = (a, cx = 0, cy = 0) => {
  const m = new Float32Array(16)
  m[ 0] = cos(a); m[ 1] = -sin(a); m[ 2] = 0; m[ 3] = 0
  m[ 4] = sin(a); m[ 5] = cos(a); m[ 6] = 0; m[ 7] = 0
  m[ 8] = 0; m[ 9] = 0; m[10] = 1; m[11] = 0
  m[12] = 0; m[13] = 0; m[14] = 0; m[15] = 1

  if (cx || cy) return [translate(-cx, -cy), m, translate(cx, cy)].reduceRight(multiply)

  return m
}

const translate = (x, y) => {
  const m = new Float32Array(16)
  m[ 0] = 1; m[ 1] = 0; m[ 2] = 0; m[ 3] = 0
  m[ 4] = 0; m[ 5] = 1; m[ 6] = 0; m[ 7] = 0
  m[ 8] = 0; m[ 9] = 0; m[10] = 1; m[11] = 0
  m[12] = x; m[13] = y; m[14] = 0; m[15] = 1

  return m
}

const scale = (f, cx = 0, cy = 0) => {
  const m = new Float32Array(16)
  m[ 0] = f; m[ 1] = 0; m[ 2] = 0; m[ 3] = 0
  m[ 4] = 0; m[ 5] = f; m[ 6] = 0; m[ 7] = 0
  m[ 8] = 0; m[ 9] = 0; m[10] = 1; m[11] = 0
  m[12] = 0; m[13] = 0; m[14] = 0; m[15] = 1

  if (cx || cy) return [m, translate(cx * (1 - f), cy * (1 - f))].reduceRight(multiply)

  return m
}

const toCss = m => 'matrix3d(' + m.join(', ') + ')'

const transform = (...transforms) => transforms.reduceRight(multiply)

export default transform
export {identity, translate, rotate, scale, toCss}
