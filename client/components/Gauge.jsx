import React, {Component, PropTypes} from 'react'
import sizeMe from 'react-sizeme'
import 'plotly'

class Gauge extends Component {

	static propTypes = {
		// passed in
		range: PropTypes.array,
		data: PropTypes.arrayOf(PropTypes.number),
		displayProperties: PropTypes.shape({
			coefficients: PropTypes.shape({
				innerRadius: PropTypes.number,
				outterRadius: PropTypes.number,
				majorGradLength: PropTypes.number,
				minorGradLength: PropTypes.number,
				indicatorWidth: PropTypes.number,
				needleWidth: PropTypes.number,
				needleLength: PropTypes.number,
				needleTextOffset: PropTypes.number
			}),
			colors: PropTypes.shape({
				majorGrad: PropTypes.string,
				minorGrad: PropTypes.string,
				majorGradText: PropTypes.string,
				needle: PropTypes.string,
				needleText: PropTypes.string
			}),
			fontSizes: PropTypes.shape({
				majorGradText: PropTypes.number,
				needleText: PropTypes.number
			}),
			rangeIndicators: PropTypes.shape({
				ranges: PropTypes.shape({
					undefined: PropTypes.arrayOf(PropTypes.number),
					safe: PropTypes.arrayOf(PropTypes.number),
					neutral: PropTypes.arrayOf(PropTypes.number),
					warning: PropTypes.arrayOf(PropTypes.number),
					danger: PropTypes.arrayOf(PropTypes.number)
				}),
				colorMap: PropTypes.shape({
					'undefined': PropTypes.string,
					'safe': PropTypes.string,
					'neutral': PropTypes.string,
					'warning': PropTypes.string,
					'danger': PropTypes.string
				})
			}),
			majorGrads: PropTypes.number,
			minorGrads: PropTypes.number
		}),
		majorGrads: PropTypes.number,
		minorGrads: PropTypes.number,
		// injected
		size: PropTypes.shape({
			width: PropTypes.number.isRequired,
			height: PropTypes.number.isRequired
		})
	}

	static defaultProps = {
		range: [0, 1],
		data: [0.5],
		displayProperties: {
			coefficients: {
				innerRadius: 0.40,
				outterRadius: 0.50,
				majorGradLength: 0.1,
				minorGradLength: 0.07,
				indicatorWidth: 0.05,
				needleWidth: 0.04,
				needleLength: 0.35,
				needleTextOffset: 0.15
			},
			colors: {
				majorGrad: '#B0B0B0',
				minorGrad: '#D0D0D0',
				majorGradText: '#6C6C6C',
				needle: '#416094',
				needleText: '#416094'
			},
			fontSizes: {
				majorGradText: 10,
				needleText: 12
			},
			rangeIndicators: {
				ranges: {
					undefined: [0, 0.2],
					safe: [0.2, 0.4],
					neutral: [0.4, 0.6],
					warning: [0.6, 0.8],
					danger: [0.8, 1]
				},
				colorMap: {
					'undefined': 'gray',
					'safe': 'green',
					'neutral': 'yellow',
					'warning': 'orange',
					'danger': 'red'
				}
			},
			majorGrads: 5,
			minorGrads: 4
		}
	}

	constructor (props) {
		super(props)
		const {size: {width}, displayProperties: {coefficients, minorGrads, majorGrads, colors, fontSizes, rangeIndicators}} = this.props
		this.canvasStatic = undefined
		this.canvasActive = undefined
		this.ctxStatic = undefined
		this.ctxActive = undefined

		this.reCalculateGlobals()

		this.display = {
			radii: {
				inner: Math.round(width*coefficients.innerRadius),
				outter: Math.round(width*coefficients.outterRadius)
			},
			grads: {
				major: {
					number: majorGrads,
					length: Math.round(width*coefficients.majorGradLength),
					color: colors.majorGrad,
					fontColor: colors.majorGradText,
					fontSize: fontSizes.majorGradText
				},
				minor: {
					number: minorGrads,
					length: Math.round(width*coefficients.minorGradLength),
					color: colors.minorGrad
				}
			},
			needle: {
				width: Math.round(width*coefficients.needleWidth),
				length: this.needleLength = Math.round(width*coefficients.needleLength),
				color: colors.needle,
				text: {
					fontColor: colors.needleText,
					fontSize: fontSizes.needleText,
					offset: Math.round(width*coefficients.needleTextOffset)
				}
			},
			indicator: {
				width: Math.round(width*coefficients.indicatorWidth),
				ranges: rangeIndicators.ranges,
				colorMap: rangeIndicators.colorMap
			}
		}
		this.majorGrads = majorGrads
		this.minorGrads = minorGrads
		this.majorGradColor = colors.majorGrads
		this.minorGradColor = colors.minorGrads
		this.majorGradTextColor = colors.majorGradText
		this.majorGradsFontSize = fontSizes.majorGradText

		this.needleColor = colors.needle
		this.needleFontColor = colors.needleText
		this.needleFontSize = fontSizes.needleText
		
		this.indicatorColorMap = {
			'undefined': 'gray',
			'safe': 'green',
			'neutral': 'yellow',
			'warning': 'orange',
			'danger': 'red'
		}
	}

	reCalculateGlobals = () => {
		const {size: {width}, displayProperties: {coefficients}} = this.props
		this.innerRadius = Math.round(width*coefficients.innerRadius)
		this.outterRadius = Math.round(width*coefficients.outterRadius)
		this.majorGradLength = Math.round(width*coefficients.majorGradLength)
		this.minorGradLength = Math.round(width*coefficients.minorGradLength)
		this.indicatorWidth = Math.round(width*coefficients.indicatorWidth)
		this.needleWidth = Math.round(width*coefficients.needleWidth)
		this.needleLength = Math.round(width*coefficients.needleLength)
		this.needleTextOffset = Math.round(width*coefficients.needleTextOffset)
	}

	componentDidMount() {
		this.ctxStatic = this.canvasStatic.getContext('2d')
		this.ctxActive = this.canvasActive.getContext('2d')
		this.ctxStatic.translate(this.canvasStatic.width/2, this.canvasStatic.width/2)
		this.ctxActive.translate(this.canvasActive.width/2, this.canvasActive.width/2)

		this.drawMajorGrads(this.ctxStatic)
		this.drawMinorGrads(this.ctxStatic)
		this.drawIndicators(this.ctxStatic)

		this.drawNeedle(this.ctxActive)
	}

	componentWillReceiveProps = (nextProps) => {
		if (this.props.data[0] !== nextProps.data[0]) {
			this.ctxActive.clearRect(
				-this.canvasActive.width/2, -this.canvasActive.height/2, 
				this.canvasActive.width, this.canvasActive.height)
			this.drawNeedle(this.ctxActive)
		}
	}

	componentDidUpdate = (prevProps) => {
		if (prevProps.size !== this.props.size) {
			this.reCalculateGlobals()

			this.ctxStatic.clearRect(
				-this.canvasActive.width/2, -this.canvasActive.height/2, 
				this.canvasActive.width, this.canvasActive.height)
			this.drawMajorGrads(this.ctxStatic)
			this.drawMinorGrads(this.ctxStatic)
			this.drawIndicators(this.ctxStatic)

			this.ctxActive.clearRect(
				-this.canvasActive.width/2, -this.canvasActive.height/2, 
				this.canvasActive.width, this.canvasActive.height)
			this.drawNeedle(this.ctxActive)
		}
	}

	// Helper Functions
	getAngle = (value, range) => {
		const angleRange = Math.PI*4/3
		const minAngle = Math.PI*5/6

		return minAngle + (value * angleRange) / (range) 
	}

	getMajorGradAngles = () => {
		const majorGrads = this.display.grads.major.number
		const majorGradAngles = []

		for (let i = 0; i < majorGrads; i++) {
			majorGradAngles.push(
				this.getAngle(i, majorGrads-1)
			)
		}

		return majorGradAngles
	}

	getMinorGradAngles = () => {
		const majorGrads = this.display.grads.major.number
		const minorGrads = this.display.grads.minor.number

		const minorGradAngles = []
		for (let i = 0; i < minorGrads*majorGrads-minorGrads; i++) {
			if (i%minorGrads===0) continue
			minorGradAngles.push(
				this.getAngle(i, minorGrads*majorGrads-minorGrads)
			)
		}
		return minorGradAngles
	}

	getMajorGradValues = (precision) => {
		const {range} = this.props
		const majorGrads = this.display.grads.major.number

		const valueRange = range[1]-range[0]
		const majorGradValues = []

		for (let i = 0; i <= majorGrads; i++)
			majorGradValues.push(
				(range[0]+(i*valueRange*1.0)/(majorGrads-1)).toFixed(precision)
			)

		return majorGradValues
	}

	getMinorGradValues = (precision) => {
		const {range} = this.props
		const majorGrads = this.display.grads.major.number
		const minorGrads = this.display.grads.minor.number

		const valueRange = range[1]-range[0]
		const minorGradValues = []
		for (let i = 0; i <= minorGrads*majorGrads-minorGrads; i++) {
			if (i%minorGrads===0) continue
			minorGradValues.push(
				(range[0]+(i*valueRange)/(minorGrads*majorGrads-minorGrads)).toFixed(precision)
			)
		}
		return minorGradValues
	}

	// Drawing Functions
	drawMajorGrads = (ctx) => {
		const outterRadius = this.display.radii.outter
		const indicatorWidth = this.display.indicator.width
		const majorGradLength = this.display.grads.major.length
		const majorGradsFontSize = this.display.grads.major.fontSize

		const majorGradAngles = this.getMajorGradAngles()
		const majorGradValues = this.getMajorGradValues(2)

		ctx.strokeStyle = this.display.grads.major.color
		ctx.beginPath()
		majorGradAngles.forEach((angle, index) => {
			const x1 = Math.round(Math.cos(angle) * (outterRadius-indicatorWidth-majorGradLength))
			const y1 = Math.round(Math.sin(angle) * (outterRadius-indicatorWidth-majorGradLength))
			const x2 = Math.round(Math.cos(angle) * (outterRadius-indicatorWidth))
			const y2 = Math.round(Math.sin(angle) * (outterRadius-indicatorWidth))
			const tx = Math.round(Math.cos(angle) * (outterRadius-indicatorWidth-majorGradLength-majorGradsFontSize*1.5))
			const ty = Math.round(Math.sin(angle) * (outterRadius-indicatorWidth-majorGradLength-majorGradsFontSize*1.5))
			ctx.moveTo(x1, y1)
			ctx.lineTo(x2, y2)
			ctx.textAlign = 'center'
			ctx.font=`${this.display.grads.major.fontSize}px Arial`
			ctx.fillStyle = this.display.grads.major.fontColor
			ctx.fillText(majorGradValues[index], tx, ty)
		})
		ctx.stroke()
		ctx.closePath()
	}

	drawMinorGrads = (ctx) => {
		const minorGradAngles = this.getMinorGradAngles()
		const outterRadius = this.display.radii.outter
		const indicatorWidth = this.display.indicator.width
		const minorGradLength = this.display.grads.minor.length

		ctx.strokeStyle = this.display.grads.minor.color
		ctx.beginPath()
		minorGradAngles.forEach((angle) => {
			const x1 = Math.round(Math.cos(angle) * (outterRadius-indicatorWidth-minorGradLength))
			const y1 = Math.round(Math.sin(angle) * (outterRadius-indicatorWidth-minorGradLength))
			const x2 = Math.round(Math.cos(angle) * (outterRadius-indicatorWidth))
			const y2 = Math.round(Math.sin(angle) * (outterRadius-indicatorWidth))
			ctx.moveTo(x1, y1)
			ctx.lineTo(x2, y2)
		})
		ctx.stroke()
		ctx.closePath()
	}

	drawIndicators = (ctx) => {
		const {range} = this.props
		const indicatorRanges = this.display.indicator.ranges
		const smallRadius = this.display.radii.outter-this.display.indicator.width
		const largeRadius = this.display.radii.outter

		Object.keys(indicatorRanges).forEach((indicator) => {
			const angle1 = this.getAngle(indicatorRanges[indicator][0], range[1]-range[0])
			const angle2 = this.getAngle(indicatorRanges[indicator][1], range[1]-range[0])
			const x1 = Math.round(Math.cos(angle1) * smallRadius)
			const y1 = Math.round(Math.sin(angle1) * smallRadius)
			const x2 = Math.round(Math.cos(angle1) * largeRadius)
			const y2 = Math.round(Math.sin(angle1) * largeRadius)
			// arc handles navigating to pt. 3
			const x4 = Math.round(Math.cos(angle2) * smallRadius)
			const y4 = Math.round(Math.sin(angle2) * smallRadius)

			ctx.fillStyle = this.display.indicator.colorMap[indicator]
			ctx.beginPath()
			ctx.moveTo(x1, y1)
			ctx.lineTo(x2, y2)
			ctx.arc(0, 0, largeRadius, angle1, angle2)
			ctx.lineTo(x4, y4)
			ctx.arc(0, 0, smallRadius, angle2, angle1, true)
			ctx.fill()
			ctx.closePath()
		})
	}

	drawNeedle = (ctx) => {
		const {range, data} = this.props
		const needleWidth = this.display.needle.width
		const needleAngle = this.getAngle(data[0], range[1]-range[0])

		ctx.rotate(needleAngle)
		ctx.beginPath()
		ctx.fillStyle = this.display.needle.color
		ctx.strokeStyle = 'rgba(0, 0, 0, 0)'
		ctx.moveTo(0, -needleWidth/2)
		ctx.lineTo(0, needleWidth/2)
		ctx.lineTo(this.display.needle.length, 0)
		ctx.closePath()
		ctx.fill()

		ctx.beginPath()
		ctx.moveTo(0, 0)
		ctx.arc(0, 0, needleWidth*0.8, 0, 2*Math.PI)
		ctx.closePath()
		ctx.fill()
		ctx.rotate(-needleAngle)

		ctx.font=`${this.display.needle.text.fontSize}px Arial`
		ctx.textAlign = 'center'
		ctx.fillText(`${data[0]}`, 0, this.display.needle.text.offset)
	}

	render () {
		const divStyle = {
			width: this.props.size.width,
			height: this.props.size.width*0.8
		}
		return (
			<div style={divStyle}>
				<canvas {...divStyle} ref={(ref) => this.canvasStatic=ref}></canvas>
				<canvas {...divStyle} ref={(ref) => this.canvasActive=ref}></canvas>
			</div>
		)
	}
}

export default sizeMe({ monitorHeight: true, monitorWidth: true })(Gauge)