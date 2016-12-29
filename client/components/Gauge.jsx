import React, {Component, PropTypes} from 'react'
import 'plotly'

export default class Gauge extends Component {
	constructor (props) {
		super(props)
	}

	render () {

		return (
			<div>{this.props.range[0]}</div>
		)
	}
}

Gauge.propTypes = {
	range: PropTypes.array
}
Gauge.defaultProps = {
	range: [0, 1]
}
