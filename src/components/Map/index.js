import React, { Component, Fragment } from "react"
import { StyleSheet, View } from "react-native"
import MapWrapper from "../MapWrapper"
import MapView, { UrlTile, Marker } from "react-native-maps"
import Loading from "../Loading"

export default class Map extends Component {
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

	templateURL = "http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"

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

		if (this.props.onPositionChange !== null) {
			this.props.onPositionChange(position.coords)
		}
	}

	onPositionError(error) {
		this.setState({ error: error.message, loading: false })
	}

	componentWillUnmount() {
		navigator.geolocation.clearWatch(this.watchId)
	}

	renderMap() {
		return (
			<MapWrapper
				latitude={this.state.latitude}
				longitude={this.state.longitude}
				render={coordinate => (
					<MapView
						zoomEnabled={false}
						mapType="none"
						style={styles.map}
						initialRegion={{
							latitude: coordinate.latitude,
							longitude: coordinate.longitude,
							latitudeDelta: coordinate.latitudeDelta,
							longitudeDelta: coordinate.longitudeDelta
						}}>
						<UrlTile urlTemplate={this.templateURL} zIndex={-3} />

						<Marker
							coordinate={{
								latitude: this.state.latitude,
								longitude: this.state.longitude
							}}>
							<View style={styles.markerOutline}>
								<View style={styles.marker} />
							</View>
						</Marker>

						{this.props.render(coordinate)}
					</MapView>
				)}
			/>
		)
	}

	renderMapWhenLoadingComplete() {
		return (
			<Fragment>
				<Loading text="Finding Location..." visible={this.state.loading} />
				{this.state.loading ? null : this.renderMap()}
			</Fragment>
		)
	}

	render() {
		return this.renderMapWhenLoadingComplete()
	}
}

const styles = StyleSheet.create({
	map: {
		flex: 6
	},
	markerOutline: {
		backgroundColor: "white",
		borderRadius: 50,
		height: 25,
		width: 25,
		justifyContent: "center",
		alignItems: "center"
	},
	marker: {
		backgroundColor: "#0089CC",
		borderRadius: 50,
		height: 20,
		width: 20
	}
})
