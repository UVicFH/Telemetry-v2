import React, {Component} from 'react'
import Panel from './Panel'
import io from 'socket.io-client'

const socket = io()

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
						<Frame header="Dash"/>
					</div>
					<div className="col-md-8">
						<Frame header="Graphs"/>
					</div>
				</div>
			</div>
		)
	}
}
