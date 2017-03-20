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
