import React, {Component, PropTypes} from 'react'
import 'plotly'

export default class Gauge extends Component {
	constructor (props) {
		super(props)
		const {width, minorGrads, majorGrads} = this.props
		this.node = undefined

		// ToDo: scale according to width (use % instead of x/300)
		this.innerRadius = Math.round(width*130/300)
		this.outterRadius = Math.round(width*145/300)
		this.majorGrads = majorGrads-1
		this.minorGrads = minorGrads
		this.majorGradLength = Math.round(width*16/300)
		this.minorGradLength = Math.round(width*10/300)
		this.gradMarginTop = Math.round(width*7/30)
		this.majorGradColor = 'B0B0B0'
		this.minorGradColor = '#D0D0D0'
		this.majorGradTextColor = '6C6C6C'
		this.majorGradsTextSize = 10
		this.needleColor = '#416094'
		this.needleTextOffset = Math.round(width*30/300)
		this.needleTextSize = 8
	}

	componentDidMount() {
		this.buildMinorGrads()
	}

	// Helper Functions
	getMajorGradAngles = () => {
		const angleRange = Math.PI*4/3
		const minAngle = -Math.PI*2/3
		const majorGradAngles = []
		for (let i = 0; i <= this.majorGrads; i++){
			majorGradAngles.push(
				minAngle+(i*angleRange)/this.majorGrads
			)}
		return majorGradAngles
	}

	getMajorGradValues = () => {
		const {range} = this.props
		const valueRange = range[1]-range[0]
		const majorGradValues = []
		for (let i = 0; i <= this.majorGrads; i++)
			majorGradValues.push(
				range[0]+(i*valueRange)/this.majorGrads.toFixed(0)
			)
		return majorGradValues
	}

	// Construction Functions
	buildMinorGrads = () => {
		const {width} = this.props

		const centerX = width/2
		const centerY = width/2

		const majorGradAngles = this.getMajorGradAngles()
		console.log(majorGradAngles)
		const ctx = this.node.getContext('2d')
		ctx.translate(this.node.width/2, this.node.width/2)
		ctx.strokeStyle = this.minorGraduationColor
		
		majorGradAngles.forEach((angle) => {
			const x1 = Math.round(Math.cos(Math.PI/2 - angle) * (this.innerRadius-this.gradMarginTop-this.majorGradLength))
			const y1 = -Math.round(Math.sin(Math.PI/2 - angle) * (this.innerRadius-this.gradMarginTop-this.majorGradLength))
			const x2 = Math.round(Math.cos(Math.PI/2 - angle) * (this.innerRadius-this.gradMarginTop))
			const y2 = -Math.round(Math.sin(Math.PI/2 - angle) * (this.innerRadius-this.gradMarginTop))
			console.log(`x1: ${x1}, y1: ${y1}, x2: ${x2}, y2: ${y2}`)
			ctx.beginPath()
			ctx.moveTo(x1, y1)
			ctx.lineTo(x2, y2)
			ctx.stroke()
		})
	}

	buildMajorGrads = () => {
		return (undefined)
	}

	componentDidUpdate = () => {
		return (undefined)
	}

	componentWillUnmount = () => {
		// destroy node
		return (undefined)
	}

	render () {

		return (
			<div>
				<div>{this.props.range[0]}</div>
				<canvas width height={this.props.width} ref={(gauge) => this.node=gauge}></canvas>
			</div>
		)
	}
}

Gauge.propTypes = {
	range: PropTypes.array,
	width: PropTypes.number,
	majorGrads: PropTypes.number,
	minorGrads: PropTypes.number
}
Gauge.defaultProps = {
	range: [0, 1],
	width: 300, 		// to be removed later
	majorGrads: 5,
	minorGrads: 10
}
