import React, {Component, PropTypes} from 'react'
import 'plotly'

export default class Gauge extends Component {
	constructor (props) {
		super(props)
		const {width, minorGrads, majorGrads} = this.props
		this.node = this.getDOMNode()

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

	// Helper Functions
	getMajorGradAngles = () => {
		const angleRange = 240
		const minAngle = -120
		const majorGradAngles = []
		for (let i = 0; i <= this.majorGrads; i++)
			majorGradAngles.push(
				minAngle+(i*angleRange)/this.majorGrads
			)
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
		return (undefined)
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
			<div>{this.props.range[0]}</div>
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
