import React, { Component, Fragment } from "react"
import { StyleSheet, Modal, Button } from "react-native"
import { Polyline } from "react-native-maps"

import Map from "../../components/Map"
import SegmentDetail from "./components/SegmentDetail"

import { webservice } from "../../config/api"
import axios from "axios"
import { withNavigationFocus } from "react-navigation"
import hexRgb from "hex-rgb"

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
		selected_segment: {}
	}

	componentDidMount() {
		this.loadDamagedSegments()
	}

	loadDamagedSegments() {
		axios.get(webservice + "/damaged_road").then(response => {
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
			console.log(item.coordinates)
			console.log(item.damage_type)
			return (
				<Polyline
					key={index}
					coordinates={item.coordinates}
					strokeColor={this.hexToRgba(
						item.damage_type.color,
						item.damage_level.alpha
					)}
					strokeWidth={7}
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
		console.log(this.state.damaged_segments)
		return (
			<Fragment>
				<Map render={coordinate => this.renderPolyline()} />

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
