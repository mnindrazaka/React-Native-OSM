import React, { Component, Fragment } from "react"
import { StyleSheet, Text, View } from "react-native"
import { Polyline } from "react-native-maps"

import Map from "../../components/Map"
import SelectedSegments from "./components/SelectedSegments"

import { webservice } from "../../config/api"
import axios from "axios"

export default class EditRoad extends Component {
	static navigationOptions = {
		title: "Edit Road"
	}

	state = {
		segments: [],
		selected_segments: []
	}

	componentDidMount() {
		this.loadSegments()
	}

	loadSegments() {
		axios.get(webservice + "/damaged_road").then(response => {
			this.setState({ segments: response.data })
		})
	}

	renderPolyline() {
		const segment_color = "rgba(200, 200, 200, 1)"
		const selected_segment_color = "rgba(0, 0, 0, 0.5)"

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
				<Map style={styles.map} render={coordinate => this.renderPolyline()} />

				<SelectedSegments
					onSubmitButtonPress={() => this.navigateToForm()}
					onClearButtonPress={() => this.clearSelectedSegment()}
					style={styles.selectedSements}
					count={this.state.selected_segments.length}
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
