import React, {Component, PropTypes} from 'react'
import sizeMe from 'react-sizeme'
import 'plotly'

class Gauge extends Component {

	static propTypes = {
		// passed in
		range: PropTypes.array,
		rangeIndicators: PropTypes.shape({
			undefined: PropTypes.arrayOf(PropTypes.number),
			safe: PropTypes.arrayOf(PropTypes.number),
			neutral: PropTypes.arrayOf(PropTypes.number),
			warning: PropTypes.arrayOf(PropTypes.number),
			danger: PropTypes.arrayOf(PropTypes.number)
		}),
		value: PropTypes.number,
		majorGrads: PropTypes.number,
		minorGrads: PropTypes.number,
		// injected
		size: PropTypes.shape({
			width: PropTypes.number.isRequired,
			height: PropTypes.number.isRequired
		})
	}
	static defaultProps = {
		range: [0, 1],
		rangeIndicators: {
			undefined: [0, 0.2],
			safe: [0.2, 0.4],
			neutral: [0.4, 0.6],
			warning: [0.6, 0.8],
			danger: [0.8, 1]
		},
		value: 0.5,
		majorGrads: 5,
		minorGrads: 4,
	}

	constructor (props) {
		super(props)
		const {size: {width}, minorGrads, majorGrads} = this.props
		this.canvasStatic = undefined
		this.canvasActive = undefined
		this.ctxStatic = undefined
		this.ctxActive = undefined

		// ToDo: scale according to width (use % instead of x/300)
		this.innerRadius = Math.round(width*130/300)
		this.outterRadius = Math.round(width*145/300)
		this.majorGrads = majorGrads
		this.minorGrads = minorGrads
		this.majorGradLength = Math.round(width*16/300)
		this.minorGradLength = Math.round(width*10/300)
		this.gradMarginTop = Math.round(width*3/30)
		this.majorGradColor = 'B0B0B0'
		this.minorGradColor = '#D0D0D0'
		this.majorGradTextColor = '6C6C6C'
		this.majorGradsFontSize = 10
		this.indicatorWidth = 20
		this.indicatorColorMap = {
			'undefined': 'gray',
			'safe': 'green',
			'neutral': 'yellow',
			'warning': 'orange',
			'danger': 'red'
		}
		this.needleColor = '#416094'
		this.needleWidth = 6
		this.needleLength = this.innerRadius - this.majorGradLength - this.gradMarginTop
		this.needleTextOffset = Math.round(width*30/300)
		this.needleFontSize = 12
	}

	componentDidMount() {
		this.ctxStatic = this.canvasStatic.getContext('2d')
		this.ctxActive = this.canvasActive.getContext('2d')
		this.ctxStatic.translate(this.canvasStatic.width/2, this.canvasStatic.width/2)
		this.ctxActive.translate(this.canvasActive.width/2, this.canvasActive.width/2)

		this.drawMajorGrads(this.ctxStatic)
		this.drawMinorGrads(this.ctxStatic)
		this.drawIndicators(this.ctxStatic)

		this.drawNeedle(this.ctxActive)
	}

	componentDidReceiveProps = (nextProps) => {

	}

	componentDidUpdate = () => {
		return (undefined)
	}

	componentWillUnmount = () => {
		// destroy canvas'
		return (undefined)
	}

	// Helper Functions
	getAngle = (value, range) => {
		const angleRange = Math.PI*4/3
		const minAngle = Math.PI*5/6

		return minAngle + (value * angleRange) / (range) 
	}

	getMajorGradAngles = () => {
		const majorGradAngles = []
		for (let i = 0; i < this.majorGrads; i++) {
			majorGradAngles.push(
				this.getAngle(i, this.majorGrads-1)
			)
		}
		return majorGradAngles
	}

	getMinorGradAngles = () => {
		const minorGradAngles = []
		for (let i = 0; i < this.minorGrads*this.majorGrads-this.minorGrads; i++) {
			if (i%this.minorGrads===0) continue
			minorGradAngles.push(
				this.getAngle(i, this.minorGrads*this.majorGrads-this.minorGrads)
			)
		}
		return minorGradAngles
	}

	getMajorGradValues = (precision) => {
		const {range} = this.props
		const valueRange = range[1]-range[0]
		const majorGradValues = []
		for (let i = 0; i <= this.majorGrads; i++)
			majorGradValues.push(
				(range[0]+(i*valueRange*1.0)/(this.majorGrads-1)).toFixed(precision)
			)
		return majorGradValues
	}

	getMinorGradValues = (precision) => {
		const {range} = this.props
		const valueRange = range[1]-range[0]
		const minorGradValues = []
		for (let i = 0; i <= this.minorGrads*this.majorGrads-this.minorGrads; i++) {
			if (i%this.minorGrads===0) continue
			minorGradValues.push(
				(range[0]+(i*valueRange)/(this.minorGrads*this.majorGrads-this.minorGrads)).toFixed(precision)
			)
		}
		return minorGradValues
	}

	// Construction Functions
	drawMajorGrads = (ctx) => {
		const majorGradAngles = this.getMajorGradAngles()
		const majorGradValues = this.getMajorGradValues(2)
		ctx.strokeStyle = this.majorGradColor
		ctx.beginPath()

		majorGradAngles.forEach((angle, index) => {
			const x1 = Math.round(Math.cos(angle) * (this.outterRadius-this.gradMarginTop-this.majorGradLength))
			const y1 = Math.round(Math.sin(angle) * (this.outterRadius-this.gradMarginTop-this.majorGradLength))
			const x2 = Math.round(Math.cos(angle) * (this.outterRadius-this.gradMarginTop))
			const y2 = Math.round(Math.sin(angle) * (this.outterRadius-this.gradMarginTop))
			const tx = Math.round(Math.cos(angle) * (this.outterRadius-this.gradMarginTop-this.majorGradLength-this.majorGradsFontSize*1.5))
			const ty = Math.round(Math.sin(angle) * (this.outterRadius-this.gradMarginTop-this.majorGradLength-this.majorGradsFontSize*1.5))
			console.log(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}`)
			ctx.moveTo(x1, y1)
			ctx.lineTo(x2, y2)
			ctx.textAlign = 'center'
			ctx.font=`${this.majorGradsFontSize} Arial`
			ctx.fillText(majorGradValues[index], tx, ty)
		})
		ctx.stroke()
	}

	drawMinorGrads = (ctx) => {
		const minorGradAngles = this.getMinorGradAngles()
		console.log(minorGradAngles)
		ctx.strokeStyle = this.minorGradColor
		ctx.beginPath()

		minorGradAngles.forEach((angle) => {
			const x1 = Math.round(Math.cos(angle) * (this.outterRadius-this.gradMarginTop-this.minorGradLength))
			const y1 = Math.round(Math.sin(angle) * (this.outterRadius-this.gradMarginTop-this.minorGradLength))
			const x2 = Math.round(Math.cos(angle) * (this.outterRadius-this.gradMarginTop))
			const y2 = Math.round(Math.sin(angle) * (this.outterRadius-this.gradMarginTop))
			console.log(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}`)
			ctx.moveTo(x1, y1)
			ctx.lineTo(x2, y2)
		})
		ctx.stroke()
	}

	drawIndicators = (ctx) => {
		const {rangeIndicators, range} = this.props
		const smallRadius = this.outterRadius-this.gradMarginTop
		const largeRadius = this.outterRadius-this.gradMarginTop+this.indicatorWidth
		Object.keys(this.props.rangeIndicators).forEach((indicator, index) => {
			const angle1 = this.getAngle(rangeIndicators[indicator][0], range[1]-range[0])
			const angle2 = this.getAngle(rangeIndicators[indicator][1], range[1]-range[0])
			const x1 = Math.round(Math.cos(angle1) * smallRadius)
			const y1 = Math.round(Math.sin(angle1) * smallRadius)
			const x2 = Math.round(Math.cos(angle1) * largeRadius)
			const y2 = Math.round(Math.sin(angle1) * largeRadius)
			const x3 = Math.round(Math.cos(angle2) * largeRadius)
			const y3 = Math.round(Math.sin(angle2) * largeRadius)
			const x4 = Math.round(Math.cos(angle2) * smallRadius)
			const y4 = Math.round(Math.sin(angle2) * smallRadius)
			console.log(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}, x3: ${x3}, y3: ${y3}, x4: ${x4}, y4: ${y4}, angle1: ${angle1}, angle2: ${angle2}`)

			ctx.fillStyle = this.indicatorColorMap[indicator]
			ctx.beginPath()
			ctx.moveTo(x1, y1)
			ctx.lineTo(x2, y2)
			ctx.arc(0, 0, largeRadius, angle1, angle2)
			ctx.lineTo(x3, y3)
			ctx.arc(0, 0, smallRadius, angle2, angle1, true)
			ctx.moveTo(x1, y1)
			ctx.closePath()
			ctx.fill()
		})
	}

	drawNeedle = (ctx) => {
		const {range, value} = this.props
		const needleAngle = this.getAngle(value, range[1]-range[0])

		ctx.beginPath()
		ctx.rotate(needleAngle)
		ctx.fillStyle = this.needleColor
		ctx.strokeStyle = 'rgba(0, 0, 0, 0)'
		ctx.moveTo(0, -this.needleWidth/2)
		ctx.lineTo(0, this.needleWidth/2)
		ctx.lineTo(this.needleLength, 0)
		ctx.fill()
		ctx.moveTo(0, 0)
		ctx.arc(0, 0, this.needleWidth*0.8, 0, 2*Math.PI)
		ctx.fill()
		ctx.rotate(-needleAngle)
		ctx.font=`${this.needleFontSize}px Arial`
		ctx.textAlign = 'center'
		ctx.fillText(`${value}`, 0, this.needleFontSize*3)
	}

	render () {
		const divStyle = {
			width: this.props.size.width,
			height: this.props.size.width
		}
		return (
			<div style={divStyle}>
				<canvas {...divStyle} ref={(ref) => this.canvasStatic=ref}></canvas>
				<canvas {...divStyle} ref={(ref) => this.canvasActive=ref}></canvas>
			</div>
		)
	}
}

export default sizeMe({ monitorHeight: true, monitorWidth: true })(Gauge)