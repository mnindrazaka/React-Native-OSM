import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import AppWithRoute from './src/index'
import Context from './context'
import Loading from './src/components/Loading'

export default class App extends Component {
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
			<Context.Provider
				value={{
					latitude: this.state.latitude,
					longitude: this.state.longitude
				}}>
				<View style={styles.container}>
					{this.state.loading ? <Loading visible={true} /> : <AppWithRoute />}
				</View>
			</Context.Provider>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%'
	}
})
