import React, { Component, Fragment } from "react"
import { StyleSheet, Text } from "react-native"
import MapView, { Polyline, UrlTile } from "react-native-maps"

import Loading from "../../components/Loading"
import MapWrapper from "../../components/MapWrapper"
import SelectedSegments from "./components/SelectedSegments"

import { webservice } from "../../config/api"
import axios from "axios"

export default class EditRoad extends Component {
	static navigationOptions = {
		title: "Edit Road"
	}

	state = {
		loading: false,
		segments: [],
		selected_segments: [],
		latitude: null,
		longitude: null,
		error: null
	}

	componentWillMount() {
		this.setState({ loading: true }, () => {
			this.watchPosition()
			this.load_segments()
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

	load_segments() {
		axios.get(webservice + "/damaged_road").then(response => {
			this.setState({ segments: response.data })
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
		const segment_color = "black"
		const selected_segment_color = "blue"

		return this.state.segments.map((item, index) => {
			const selected = this.isSegmentSelected(item)
			return (
				<Polyline
					key={index}
					coordinates={item.coordinates}
					strokeColor={selected ? selected_segment_color : segment_color}
					strokeWidth={10}
					onPress={() =>
						selected ? this.unselectSegment(item) : this.selectSegment(item)
					}
				/>
			)
		})
	}

	isSegmentSelected(segment) {
		let selected = false
		this.state.selected_segments.forEach(item => {
			console.log("item", item)
			console.log("segment", segment)
			if (item.osm_id === segment.osm_id && item.sid === segment.sid) {
				selected = true
			}
		})
		return selected
	}

	selectSegment(segment) {
		let selected_segments = this.state.selected_segments
		selected_segments.push(segment)
		this.setState({ selected_segments })
	}

	unselectSegment(segment) {
		let selected_segments = this.state.selected_segments.filter(item => {
			return item.osm_id !== segment.osm_id || item.sid !== segment.sid
		})
		this.setState({ selected_segments })
	}

	clearSelectedSegment() {
		this.setState({ selected_segments: [] })
	}

	navigateToForm() {
		this.props.navigation.navigate("FormEditSegments", {
			segments: this.state.selected_segments
		})
	}

	render() {
		return (
			<Fragment>
				{/* Show map when loading done */}
				{this.state.loading ? (
					<Loading text={"Finding Location..."} s />
				) : (
					<Fragment>
						{this.renderMap()}
						<SelectedSegments
							onSubmitButtonPress={() => this.navigateToForm()}
							onClearButtonPress={() => this.clearSelectedSegment()}
							style={styles.selectedSements}
							count={this.state.selected_segments.length}
						/>
					</Fragment>
				)}
			</Fragment>
		)
	}
}

const styles = StyleSheet.create({
	map: {
		flex: 6
	},
	selectedSements: {
		flex: 1
	}
})
