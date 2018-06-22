/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react"
import { View, Text, StyleSheet } from "react-native"
import MapView, { UrlTile, Polyline } from "react-native-maps"
import Loading from "./src/components/Loading"

export default class App extends Component {
	state = {
		damaged_road: [],
		loading: false,
		loadingText: "",
		latitude: null,
		longitude: null,
		latitudeDelta: null,
		longitudeDelta: null,
		error: null
	}

	componentWillMount() {
		this.setState({ loading: true, loadingText: "Finding Location..." }, () => {
			this.watchPosition()
		})
	}

	componentDidMount() {
		this.load_damaged_road()
	}

	watchPosition() {
		this.watchId = navigator.geolocation.watchPosition(
			position => {
				let data = this.regionFrom(
					position.coords.latitude,
					position.coords.longitude,
					6
				)
				this.setState({ ...data, loading: false, error: null })
			},
			error => this.setState({ error: error.message, loading: false }),
			{ timeout: 30000, maximumAge: 1000 }
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
				Math.cos(angularDistance) - Math.sin(lat) * Math.sin(lat)
			)
		)

		return (result = {
			latitude: lat,
			longitude: lon,
			latitudeDelta,
			longitudeDelta
		})
	}

	componentWillUnmount() {
		navigator.geolocation.clearWatch(this.watchId)
	}

	load_damaged_road() {
		fetch("http://192.168.1.6:3000/api/damaged_road")
			.then(response => response.json())
			.then(responseJson => {
				this.setState({ damaged_road: responseJson })
			})
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
					longitudeDelta: this.state.longitudeDelta
				}}>
				{this.renderPolyline()}
				<UrlTile
					urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
					zIndex={-3}
				/>
			</MapView>
		)
	}

	renderPolyline() {
		return this.state.damaged_road.map((item, index) => (
			<Polyline
				key={index}
				coordinates={item.coordinates}
				strokeColor={item.color}
				strokeWidth={10}
			/>
		))
	}

	render() {
		console.log(this.state)
		return (
			<View style={styles.container}>
				{this.state.loading ? (
					<Loading text={this.state.loadingText} />
				) : (
					this.renderMap()
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
		backgroundColor: "#F5FCFF"
	}
})
