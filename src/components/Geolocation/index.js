import React, { Component } from 'react'
import Context from '../../context'

class Geolocation extends Component {
	state = {
		latitude: null,
		longitude: null,
		error: null,
		loading: false
	}

	watchOptions = {
		timeout: 10000,
		maximumAge: 1000
	}

	componentWillMount() {
		this.loading()
		this.watchPosition()
	}

	loading() {
		this.setState({ loading: true })
	}

	unloading() {
		this.setState({ loading: false })
	}

	watchPosition() {
		this.watchId = navigator.geolocation.watchPosition(
			position => this.setPosition(position),
			error => this.onPositionError(error),
			this.watchOptions
		)
	}

	setPosition(position) {
		const { latitude, longitude } = position.coords
		this.setState({ latitude, longitude, loading: false, error: null })
	}

	onPositionError(error) {
		this.setState({ error: error.message, loading: false })
	}

	componentWillUnmount() {
		navigator.geolocation.clearWatch(this.watchId)
	}

	render() {
		return (
			<Context.Provider value={{ ...this.state }}>
				{this.props.children}
			</Context.Provider>
		)
	}
}

export default Geolocation
