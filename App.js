/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react"
import { View, Text, StyleSheet } from "react-native"
import MapView, { UrlTile } from "react-native-maps"
import Spinner from "react-native-loading-spinner-overlay"

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			latitude: null,
			longitude: null,
			latitudeDelta: null,
			longitudeDelta: null,
			error: null,
		}
	}

	componentDidMount() {
		this.watchPosition()
	}

	watchPosition() {
		this.watchId = navigator.geolocation.watchPosition(
			position => {
				let data = this.regionFrom(
					position.coords.latitude,
					position.coords.longitude,
					6,
				)

				this.setState({ ...data, error: null })
			},
			error => this.setState({ error: error.message }),
			{ timeout: 30000, maximumAge: 1000 },
		)
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
				Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat),
			),
		)

		return (result = {
			latitude: lat,
			longitude: lon,
			latitudeDelta,
			longitudeDelta,
		})
	}

	componentWillUnmount() {
		navigator.geolocation.clearWatch(this.watchId)
	}

	renderMap() {
		return (
			<MapView
				showsUserLocation
				mapType="none"
				style={{ width: "100%", height: "100%" }}
				initialRegion={{
					latitude: this.state.latitude,
					longitude: this.state.longitude,
					latitudeDelta: this.state.latitudeDelta,
					longitudeDelta: this.state.longitudeDelta,
				}}>
				<UrlTile urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png" />
			</MapView>
		)
	}

	render() {
		console.log(this.state)
		return (
			<View style={styles.container}>
				{this.state.latitude !== null ? (
					this.renderMap()
				) : (
					<Spinner
						visible={true}
						overlayColor="rgb(0, 131, 235)"
						textContent={"Finding Current Location..."}
						textStyle={{ color: "#FFF" }}
					/>
				)}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#F5FCFF",
	},
})
