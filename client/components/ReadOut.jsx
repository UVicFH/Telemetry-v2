import React, {Component, PropTypes} from 'react'

export default class ReadOut extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const {data, unit} = this.props

		if (data.length !== 1 || !Array.isArray(data)) {
			console.error(`data should be an array of length 1; not:`)
			console.log(data)
		}

		return (
			<div className="well">
				<p className="h4">{`${data[0]} ${unit}`}</p>
			</div>
		)
	}
}

ReadOut.propTypes = {
	data: PropTypes.array,
	unit: PropTypes.string
}
ReadOut.defaultProps = {
	data: [-1],
	unit: ''
}
