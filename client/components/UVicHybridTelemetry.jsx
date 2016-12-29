import React, {Component, PropTypes} from 'react'
import Dash from './Dash'
import io from 'socket.io-client'

// import plotly from 'plotly'

export default class UVicHybridTelemetry extends Component {
	constructor (props) {
		super(props)
	}

	render () {
		return (
			<Dash layout={this.props.layout} />
		)
	}
}

UVicHybridTelemetry.propTypes = {
	layout: PropTypes.array.isRequired
}
