class Path {
  pathList: Array<String> = []

  M(x: number, y: number): Path {
    const path = `M ${x} ${y}`
    this.pathList.push(path)
    return this
  }

  V(y: number): Path {
    const path = `V ${y}`
    this.pathList.push(path)
    return this
  }

  H(x: number): Path {
    const path = `H ${x}`
    this.pathList.push(path)
    return this
  }

  Z(): Path {
    const path = 'Z'
    this.pathList.push(path)
    return this
  }

  L(x: number, y: number): Path {
    const path = `L ${x} ${y}`
    this.pathList.push(path)
    return this
  }

  /**
   * 椭圆
   * @param rx number x轴半径
   * @param ry y轴半径
   * @param xAxisRotation 圆弧旋转角度
   * @param largeAcrFlag 弧线大小 0——小角度， 1——大角度
   * @param sweepFlag 弧线方向 0——从起点到终点沿逆时针 1——起点到终点沿顺时针
   * @param x x轴终点
   * @param y y轴终点
   */
  A(
    rx: number,
    ry: number,
    xAxisRotation: number,
    largeAcrFlag: number,
    sweepFlag: number,
    x: number,
    y: number
  ) {
    const path = `A ${rx} ${ry} ${xAxisRotation} ${largeAcrFlag} ${sweepFlag} ${x} ${y}`
    this.pathList.push(path)
    return this
  }

  getPath(): string {
    const result = this.pathList.join(' ')
    this.pathList = []
    return result
  }

  /**
   * 矩形
   * @param x x轴起点
   * @param y y轴起点
   * @param width 宽度
   * @param height 高度
   * @param rx border-radius x
   * @param ry border-radius y
   */
  rect(
    x: number,
    y: number,
    width: number,
    height: number,
    rx?: number,
    ry?: number
  ): Path {
    /*
     * rx 和 ry 的规则是：
     * 1. 如果其中一个设置为 0 则圆角不生效
     * 2. 如果有一个没有设置则取值为另一个
     */
    rx = rx || 0
    ry = ry || rx || 0
    // 非数值单位计算，如当宽度像100%则移除
    if (isNaN(x - y + width - height + rx - ry)) throw 'invalid params'
    rx = rx > width / 2 ? width / 2 : rx
    ry = ry > height / 2 ? height / 2 : ry

    if (rx === 0 || ry === 0) {
      this.m(x, y)
        .h(width + x)
        .v(height + y)
        .h(x)
        .z()
      return this
    } else {
      this.m(x, y + ry)
        .a(rx, ry, 0, 0, 1, x + rx, y)
        .h(width + x - rx)
        .a(rx, ry, 0, 0, 1, width + x, y + ry)
        .v(height + y - ry)
        .a(rx, ry, 0, 0, 1, width + x - rx, y + height)
        .h(x + rx)
        .a(rx, ry, 0, 0, 1, x, y + height - ry)
        .z()
    }
    return this
  }

  circle(rx: number, ry: number, radius: number): Path {
    this.m(rx - radius, ry)
      .a(radius, radius, 0, 1, 1, rx + radius, ry)
      .a(radius, radius, 0, 1, 1, rx - radius, ry)
    return this
  }

  v = this.V
  z = this.Z
  h = this.H
  m = this.M
  a = this.A
  moveTo = this.M
  lineTo = this.L
}

function setAttr(el: SVGElement) {
  el.setAttribute('stroke', 'black')
  el.setAttribute('stroke-width', '1')
  el.setAttribute('fill', 'transparent')
}
const path = new Path()

// rect
const RectPathEl = document.createElementNS(
  'http://www.w3.org/2000/svg',
  'path'
)
setAttr(RectPathEl)
RectPathEl.setAttribute('d', path.rect(30, 40, 100, 100).getPath())
const container = document.getElementById('svg')

// rect with border
const RectPathWithBorderEl = document.createElementNS(
  'http://www.w3.org/2000/svg',
  'path'
)
setAttr(RectPathWithBorderEl)
RectPathWithBorderEl.setAttribute(
  'd',
  path.rect(10, 150, 100, 100, 20, 20).getPath()
)

// line1
const LineEl = document.createElementNS('http://www.w3.org/2000/svg', 'path')
setAttr(LineEl)
LineEl.setAttribute('d', path.moveTo(10, 10).H(100).getPath())

// line2
const LineEl2 = document.createElementNS('http://www.w3.org/2000/svg', 'path')
setAttr(LineEl2)
LineEl2.setAttribute('d', path.moveTo(10, 10).V(100).getPath())

// circle
const Circle = document.createElementNS('http://www.w3.org/2000/svg', 'path')
setAttr(Circle)
Circle.setAttribute('d', path.circle(200, 200, 50).getPath())

if (container) {
  container.appendChild(RectPathEl)
  container.appendChild(RectPathWithBorderEl)
  container.appendChild(Circle)
  container.appendChild(LineEl)
  container.appendChild(LineEl2)
}
