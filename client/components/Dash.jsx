import React, {Component, PropTypes} from 'react'
import Panel from 'Panel'
import io from 'socket.io-client'

// import plotly from 'plotly'

export default class Dash extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: []
		}

		const socket = io()
		socket.on('data', (msg) => {
			console.log(msg)
			this.setState({data: msg})
		})
	}

	onComponentDidMount() {

	}

	render() {
		const {layout} = this.props
		const panels = []

		layout.forEach( (e) => {
			panels.push(
				<div className={`col-md-${e.width}`} key={e.header}>
					<Panel header={e.header} content={e.content} data={this.state.data}/>
				</div>
			)
		})

		return (
			<div className="container">
				<div className="row">
					{panels}
				</div>
			</div>
		)
	}
}

Dash.propTypes = {
	layout: PropTypes.array.isRequired
}
