import React, { Component, Fragment } from "react"
import { StyleSheet, Modal, Button } from "react-native"
import { Polyline } from "react-native-maps"

import Map from "../../components/Map"
import SegmentDetail from "./components/SegmentDetail"

import { webservice } from "../../config/api"
import axios from "axios"
import { withNavigationFocus } from "react-navigation"
import hexRgb from "hex-rgb"
import geodist from "geodist"

class ViewRoad extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: "View Road",
		headerRight: (
			<Button title="Edit" onPress={() => navigation.navigate("EditRoad")} />
		)
	})

	state = {
		modalVisible: false,
		damaged_segments: [],
		selected_segment: {},
		latitude: null,
		longitude: null
	}

	async updateCoordinate(coordinate) {
		const distance = this.getDistance(coordinate)

		if (this.state.latitude === null || distance > 50) {
			await this.setCoordinate(coordinate)
			this.loadDamagedSegments()
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

	loadDamagedSegments() {
		const { latitude, longitude } = this.state
		axios
			.get(webservice + "/damaged_road/" + latitude + "/" + longitude)
			.then(response => {
				this.setState({ damaged_segments: response.data })
			})
	}

	componentDidUpdate(prevProps) {
		if (this.isScreenFocused(prevProps)) this.loadDamagedSegments()
	}

	isScreenFocused(prevProps) {
		const isPreviouslyFocused = prevProps.isFocused
		const isCurrentFocused = this.props.isFocused

		return isCurrentFocused && !isPreviouslyFocused
	}

	renderPolyline() {
		return this.state.damaged_segments.map((item, index) => {
			return (
				<Polyline
					key={index}
					coordinates={item.coordinates}
					strokeColor={this.hexToRgba(
						item.damage_type.color,
						item.damage_level.alpha
					)}
					strokeWidth={15}
					onPress={() => this.showModal(item)}
				/>
			)
		})
	}

	hexToRgba(hexColor, alpha) {
		let color = hexRgb(hexColor, { format: "array" })
		color[3] = alpha

		const rgbColor = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`
		return rgbColor
	}

	showModal(selected_segment) {
		this.setState({ modalVisible: true, selected_segment })
	}

	hideModal() {
		this.setState({ modalVisible: false })
	}

	render() {
		return (
			<Fragment>
				<Map
					onPositionChange={coordinate => this.updateCoordinate(coordinate)}
					render={coordinate => this.renderPolyline()}
				/>

				<Modal
					visible={this.state.modalVisible}
					onRequestClose={() => this.hideModal()}
					animationType="slide">
					<SegmentDetail segment={this.state.selected_segment} />
				</Modal>
			</Fragment>
		)
	}
}

export default withNavigationFocus(ViewRoad)
