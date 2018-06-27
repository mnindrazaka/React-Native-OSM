import React, { Component, Fragment } from "react"
import { StyleSheet, Modal, Button } from "react-native"
import MapView, { Polyline, UrlTile } from "react-native-maps"

import Loading from "../../components/Loading"
import MapWrapper from "../../components/MapWrapper"
import SegmentDetail from "./components/SegmentDetail"

import { webservice } from "../../config/api"
import axios from "axios"

export default class ViewRoad extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: "View Road",
		headerRight: (
			<Button title="Edit" onPress={() => navigation.navigate("EditRoad")} />
		)
	})

	state = {
		loading: false,
		modalVisible: false,
		damaged_segments: [],
		selected_segment: {},
		latitude: null,
		longitude: null,
		error: null
	}

	componentWillMount() {
		this.setState({ loading: true }, () => {
			this.watchPosition()
			this.load_damaged_segments()
		})
	}

	watchPosition() {
		this.watchId = navigator.geolocation.watchPosition(
			position => {
				let { latitude, longitude } = position.coords
				this.setState({ latitude, longitude, loading: false, error: null })
			},
			error => this.setState({ error: error.message, loading: false }),
			{ timeout: 30000, maximumAge: 1000 }
		)
	}

	load_damaged_segments() {
		axios.get(webservice + "/damaged_road").then(response => {
			this.setState({ damaged_segments: response.data })
		})
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
						showsUserLocation
						mapType="none"
						style={styles.map}
						initialRegion={{
							latitude: coordinate.latitude,
							longitude: coordinate.longitude,
							latitudeDelta: coordinate.latitudeDelta,
							longitudeDelta: coordinate.longitudeDelta
						}}>
						{this.renderPolyline()}
						<UrlTile
							urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
							zIndex={-3}
						/>
					</MapView>
				)}
			/>
		)
	}

	renderPolyline() {
		return this.state.damaged_segments.map((item, index) => (
			<Polyline
				key={index}
				coordinates={item.coordinates}
				strokeColor={item.color}
				strokeWidth={10}
				onPress={() => this.showModal(item)}
			/>
		))
	}

	showModal(selected_segment) {
		this.setState({ modalVisible: true, selected_segment })
	}

	render() {
		return (
			<Fragment>
				{/* Show map when loading done */}
				{this.state.loading ? (
					<Loading text={"Finding Location..."} s />
				) : (
					this.renderMap()
				)}

				{/* Modal for segment detail */}
				<Modal
					visible={this.state.modalVisible}
					onRequestClose={() => this.setState({ modalVisible: false })}
					animationType="slide">
					<SegmentDetail segment={this.state.selected_segment} />
				</Modal>
			</Fragment>
		)
	}
}

const styles = StyleSheet.create({
	map: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: -25
	}
})
