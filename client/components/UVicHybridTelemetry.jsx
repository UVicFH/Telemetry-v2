import React, {Component} from 'react'
import Panel from './Panel'
import io from 'socket.io-client'
var socket = io()

export default class UVicHybridTelemetry extends Component {
	constructor (props) {
		super(props)

		socket.on('data', (msg) => {
			console.log(msg)
		})
	}

	render () {
		return (
			<div className="container">
				<div className="row">
					<div className="col-md-4">
						<Panel head="Dash"/>
					</div>
					<div className="col-md-8">
						<Panel head="Graphs"/>
					</div>
				</div>
			</div>
		)
	}
}
