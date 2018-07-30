import React, { Component, Fragment } from 'react'
import { Polyline } from 'react-native-maps'
import hexRgb from 'hex-rgb'
import PropTypes from 'prop-types'

class Polylines extends Component {
	renderPolyline() {
		return this.props.damaged_segments.map((item, index) => {
			return (
				<Polyline
					key={index}
					coordinates={item.coordinates}
					strokeColor={this.hexToRgba(
						item.damage_type.color,
						item.damage_level.alpha
					)}
					strokeWidth={15}
					onPress={() => this.props.onPress(item)}
				/>
			)
		})
	}

	hexToRgba(hexColor, alpha) {
		let color = hexRgb(hexColor, { format: 'array' })
		color[3] = alpha
		const rgbColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
		return rgbColor
	}

	render() {
		return <Fragment>{this.renderPolyline()}</Fragment>
	}
}

Polylines.propTypes = {
	damaged_segments: PropTypes.array.isRequired,
	onPress: PropTypes.func.isRequired
}

export default Polylines
