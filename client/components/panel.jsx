import React, {Component, PropTypes} from 'react'

export default class Panel extends Component {
	constructor (props) {
		super (props)
	}

	render () {
		const {head} = this.props

		return (
			<div>
				<div className="panel panel-default">
					<div className="panel-heading">
						<h2 className="panel-title">{head}</h2>
					</div>
					<div className="panel-body">
						<p>PanelContents</p>
					</div>
				</div>
			</div>
		)
	}
}

Panel.propTypes = {
	head: PropTypes.string.isRequired
}
Panel.defaultProps = {
}
