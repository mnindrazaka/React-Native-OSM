import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

export default class MapWrapper extends Component {
	state = {
		coordinate: {
			latitude: null,
			longitude: null,
			latitudeDelta: null,
			longitudeDelta: null
		}
	}

	componentWillMount() {
		this.setCoordinate()
	}

	setCoordinate() {
		const coordinate = this.regionFrom(
			this.props.latitude,
			this.props.longitude,
			4
		)
		this.setState({ coordinate })
	}

	regionFrom(lat, lon, distance) {
		distance = distance / 2
		const circumference = 40075
		const oneDegreeOfLatitudeInMeters = 111.32 * 1000
		const angularDistance = distance / circumference

		const latitudeDelta = distance / oneDegreeOfLatitudeInMeters
		const longitudeDelta = Math.abs(
			Math.atan2(
				Math.sin(angularDistance) * Math.cos(lat),
				Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)
			)
		)

		return {
			latitude: lat,
			longitude: lon,
			latitudeDelta,
			longitudeDelta
		}
	}

	render() {
		return <Fragment>{this.props.render(this.state.coordinate)}</Fragment>
	}
}

MapWrapper.propTypes = {
	latitude: PropTypes.number.isRequired,
	longitude: PropTypes.number.isRequired
}
