import React, {Component, PropTypes} from 'react'
import Visualizations from 'Visualizations'

export default class Panel extends Component {
	constructor (props) {
		super (props)
	}

	render () {
		const {header, content, data} = this.props
		const elements = []

		content.forEach( (e) => {
			const Visualization = Visualizations[e.type]
			console.log(data)
			const visualizationData = data.find( (d) => {
				console.log(e.dataId)
				console.log(d.dataId)
				return(e.dataId === d.dataId)
			})
			console.log(visualizationData)

			elements.push(
				<div className={`col-md-${e.width}`} key={e.header}>
					<Visualization header={e.header} data={visualizationData}/>
				</div>
			)
		})

		return (
			<div>
				{elements}
			</div>
		)
	}
}

Panel.propTypes = {
	header: PropTypes.string,
	content: PropTypes.array,
	data: PropTypes.array
}
Panel.defaultProps = {
	header: '...',
	content: [],
	data: []
}
