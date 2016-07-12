import React, {Component} from 'react'
import Panel from './Panel.jsx'

export default class UVicHybridTelemetry extends Component {
	constructor (props) {
		super(props)
	}

	render () {
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-4">
						<Panel />
					</div>
					<div className="col-md-8">
						<Panel />
					</div>
				</div>
			</div>
		)
	}
}
