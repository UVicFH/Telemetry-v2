import React, {Component, PropTypes} from 'react'
import 'plotly'

export default class Gauge extends Component {
	constructor (props) {
		super(props)
		const {width, minorGrads, majorGrads} = this.props
		this.canvasStatic = undefined
		this.canvasActive = undefined
		this.ctxStatic = undefined
		this.ctxActive = undefined

		this.needle = undefined

		// ToDo: scale according to width (use % instead of x/300)
		this.innerRadius = Math.round(width*130/300)
		this.outterRadius = Math.round(width*145/300)
		this.majorGrads = majorGrads
		this.minorGrads = minorGrads
		this.majorGradLength = Math.round(width*16/300)
		this.minorGradLength = Math.round(width*10/300)
		this.gradMarginTop = Math.round(width*7/30)
		this.majorGradColor = 'B0B0B0'
		this.minorGradColor = '#D0D0D0'
		this.majorGradTextColor = '6C6C6C'
		this.majorGradsTextSize = 10
		this.needleColor = '#416094'
		this.needleWidth = 8
		this.needleLength = this.innerRadius - 20
		this.needleTextOffset = Math.round(width*30/300)
		this.needleTextSize = 8
	}

	componentDidMount() {
		this.ctxStatic = this.canvasStatic.getContext('2d')
		this.ctxActive = this.canvasActive.getContext('2d')
		this.ctxStatic.translate(this.canvasStatic.width/2, this.canvasStatic.width/2)
		this.ctxActive.translate(this.canvasActive.width/2, this.canvasActive.width/2)

		this.ctxStatic.beginPath()
		this.drawMajorGrads(this.ctxStatic)
		this.drawMinorGrads(this.ctxStatic)
		this.ctxStatic.stroke()

		this.ctxActive.beginPath()
		this.drawNeedle(this.ctxActive)
		this.ctxActive.stroke()
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
	getAngle = (value, grads) => {
		const angleRange = Math.PI*4/3
		const minAngle = -Math.PI*2/3

		return minAngle + (value * angleRange) / (grads)
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

	getMajorGradValues = () => {
		const {range} = this.props
		const valueRange = range[1]-range[0]
		const majorGradValues = []
		for (let i = 0; i <= this.majorGrads; i++)
			majorGradValues.push(
				(range[0]+(i*valueRange)/(this.majorGrads-1)).toFixed(0)
			)
		return majorGradValues
	}

	getMinorGradValues = () => {
		const {range} = this.props
		const valueRange = range[1]-range[0]
		const minorGradValues = []
		for (let i = 0; i <= this.minorGrads*this.majorGrads-this.minorGrads; i++) {
			if (i%this.minorGrads===0) continue
			minorGradValues.push(
				(range[0]+(i*valueRange)/(this.minorGrads*this.majorGrads-this.minorGrads)).toFixed(0)
			)
		}
		return minorGradValues
	}

	// Construction Functions
	drawMajorGrads = (ctx) => {
		const majorGradAngles = this.getMajorGradAngles()
		ctx.strokeStyle = this.majorGraduationColor
		majorGradAngles.forEach((angle) => {
			const x1 = Math.round(Math.cos(Math.PI/2 - angle) * (this.outterRadius-this.gradMarginTop-this.majorGradLength))
			const y1 = -Math.round(Math.sin(Math.PI/2 - angle) * (this.outterRadius-this.gradMarginTop-this.majorGradLength))
			const x2 = Math.round(Math.cos(Math.PI/2 - angle) * (this.outterRadius-this.gradMarginTop))
			const y2 = -Math.round(Math.sin(Math.PI/2 - angle) * (this.outterRadius-this.gradMarginTop))
			console.log(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}`)
			ctx.moveTo(x1, y1)
			ctx.lineTo(x2, y2)
		})
	}

	drawMinorGrads = (ctx) => {
		const minorGradAngles = this.getMinorGradAngles()
		ctx.strokeStyle = this.minorGraduationColor
		
		minorGradAngles.forEach((angle) => {
			const x1 = Math.round(Math.cos(Math.PI/2 - angle) * (this.outterRadius-this.gradMarginTop-this.minorGradLength))
			const y1 = -Math.round(Math.sin(Math.PI/2 - angle) * (this.outterRadius-this.gradMarginTop-this.minorGradLength))
			const x2 = Math.round(Math.cos(Math.PI/2 - angle) * (this.outterRadius-this.gradMarginTop))
			const y2 = -Math.round(Math.sin(Math.PI/2 - angle) * (this.outterRadius-this.gradMarginTop))
			console.log(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}`)
			ctx.moveTo(x1, y1)
			ctx.lineTo(x2, y2)
		})
	}

	drawNeedle = (ctx) => {
		const {range, value} = this.props
		const needleAngle = this.getAngle(value, range[1]-range[0])

		ctx.rotate(needleAngle)
		ctx.fillStyle = this.needleColor
		ctx.strokeStyle = 'rgba(0,0,0,0)'
		ctx.moveTo(-this.needleWidth/2, 0)
		ctx.lineTo(this.needleWidth/2, 0)
		ctx.lineTo(0, -this.needleLength)
		ctx.fill()
		ctx.moveTo(0, 0)
		ctx.arc(0, 0, this.needleWidth*0.8, 0, 2*Math.PI)
		ctx.fill()
		ctx.rotate(-needleAngle)
	}

	render () {

		return (
			<div>
				<div>{this.props.range[0]}</div>
				<canvas width height={this.props.width} ref={(ref) => this.canvasStatic=ref}></canvas>
				<canvas width height={this.props.width} ref={(ref) => this.canvasActive=ref}></canvas>
			</div>
		)
	}
}

Gauge.propTypes = {
	range: PropTypes.array,
	width: PropTypes.number,
	majorGrads: PropTypes.number,
	minorGrads: PropTypes.number,
	value: PropTypes.number
}
Gauge.defaultProps = {
	range: [0, 1],
	width: 300, 		// to be removed later
	majorGrads: 5,
	minorGrads: 3,
	value: 0.5
}
