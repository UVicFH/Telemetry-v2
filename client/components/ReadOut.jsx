import React, {Component, PropTypes} from 'react'

export default class ReadOut extends Component {
	constructor(props) {
		super(props)
	}

	render() {
    const {data, unit} = this.props

		return (
			<div className="well">
        {`${data} ${unit}`}
      </div>
		)
	}
}

ReadOut.propTypes = {
	data: PropTypes.number,
	unit: PropTypes.string
}
ReadOut.defaultProps = {
	data: -1,
	unit: ''
}
