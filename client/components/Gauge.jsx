import React, {Component, PropTypes} from 'react'
import 'plotly'

export default class Gauge extends Component {
	constructor (props) {
		super(props)
	}

	render () {

		return (
		)
	}
}

Gauge.propTypes = {
	range: PropTypes.array
}
Gauge.defaultProps = {
	range: [0, 1]
}
