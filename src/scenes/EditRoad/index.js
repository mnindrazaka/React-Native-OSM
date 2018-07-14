import React, { Component, Fragment } from "react"
import { StyleSheet, Text, View } from "react-native"
import { Polyline } from "react-native-maps"

import Map from "../../components/Map"
import SelectedSegments from "./components/SelectedSegments"

import { webservice } from "../../config/api"
import axios from "axios"
import geodist from "geodist"

export default class EditRoad extends Component {
	static navigationOptions = {
		title: "Edit Road"
	}

	state = {
		segments: [],
		selected_segments: [],
		latitude: null,
		longitude: null
	}

	segmentColor = {
		default: "rgba(200, 200, 200, 0.7)",
		selected: "rgba(0, 0, 0, 0.5)"
	}

	async updateCoordinate(coordinate) {
		const distance = this.getDistance(coordinate)
		console.log("distance from start : " + distance)

		if (this.state.latitude === null || distance > 50) {
			console.log("load segment again")
			await this.setCoordinate(coordinate)
			this.loadSegments()
			this.clearSelectedSegment()
		}
	}

	getDistance(currentCoordinate) {
		const {
			latitude: curr_latitude,
			longitude: curr_longitude
		} = currentCoordinate

		const { latitude: prev_latitude, longitude: prev_longitude } = this.state

		return geodist(
			{
				lat: curr_latitude,
				lon: curr_longitude
			},
			{
				lat: prev_latitude,
				lon: prev_longitude
			},
			{
				unit: "meters"
			}
		)
	}

	setCoordinate(coordinate) {
		this.setState({
			...coordinate
		})
	}

	loadSegments() {
		const { latitude, longitude } = this.state
		axios
			.get(webservice + "/road_segment/" + latitude + "/" + longitude)
			.then(response => {
				this.setState({ segments: response.data })
			})
	}

	renderPolyline() {
		return this.state.segments.map((segment, index) => {
			const selected = this.isSegmentSelected(segment)
			return (
				<Polyline
					key={index}
					coordinates={segment.coordinates}
					strokeColor={
						selected ? this.segmentColor.selected : this.segmentColor.default
					}
					strokeWidth={15}
					onPress={() =>
						selected
							? this.unselectSegment(segment)
							: this.selectSegment(segment)
					}
				/>
			)
		})
	}

	isSegmentSelected(segment) {
		let selected = false
		this.state.selected_segments.forEach(item => {
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

	selectedSegmentLength() {
		let length = 0
		this.state.selected_segments.forEach(function(segment) {
			length += segment["length"]
		})
		return length
	}

	navigateToForm() {
		this.props.navigation.navigate("FormEditSegments", {
			segments: this.state.selected_segments
		})
	}

	render() {
		return (
			<Fragment>
				<Map
					style={styles.map}
					onPositionChange={coordinate => this.updateCoordinate(coordinate)}
					render={coordinate => this.renderPolyline()}
				/>

				<SelectedSegments
					onSubmitButtonPress={() => this.navigateToForm()}
					onClearButtonPress={() => this.clearSelectedSegment()}
					style={styles.selectedSements}
					count={this.state.selected_segments.length}
					segmentLength={this.selectedSegmentLength()}
				/>
			</Fragment>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	map: {
		flex: 6
	},
	selectedSements: {
		flex: 1
	}
})
