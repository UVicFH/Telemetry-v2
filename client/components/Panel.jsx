import React, {Component, PropTypes} from 'react'
import * as Visualizations from './Visualizations'

export default class Panel extends Component {
	constructor (props) {
		super (props)
	}

	render () {
		const {header, content, data} = this.props
		const elements = []

		content.forEach( (e) => {
			const Visualization = Visualizations[e.type]
			const visualizationData = data.find( (d) => {
				return(e.dataId === d.dataId)
			})

			if (visualizationData)
				elements.push(
					<div className={`col-md-${e.width}`} key={e.header}>
						<Visualization header={e.header} data={visualizationData.data}/>
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
