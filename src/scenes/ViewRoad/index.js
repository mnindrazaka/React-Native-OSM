import React, { Component, Fragment } from 'react'
import { Modal, Button } from 'react-native'

import Map from '../../components/Map'
import Polylines from './components/Polylines'
import SegmentDetail from './components/SegmentDetail'

import { webservice } from '../../config/api'
import axios from 'axios'
import { withNavigationFocus } from 'react-navigation'
import geodist from 'geodist'

class ViewRoad extends Component {
	static navigationOptions = ({ navigation }) => ({
		title: 'View Road',
		headerRight: (
			<Button title="Edit" onPress={() => navigation.navigate('EditRoad')} />
		)
	})

	state = {
		modalVisible: false,
		damaged_segments: [],
		selected_segment: {},
		latitude: null,
		longitude: null
	}

	async updateCoordinate(current_coordinate) {
		const distance = this.getDistanceFrom(current_coordinate)

		if (this.state.latitude === null || distance > 50) {
			await this.setCoordinate(current_coordinate)
			this.loadDamagedSegments()
		}
	}

	getDistanceFrom(currentCoordinate) {
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
				unit: 'meters'
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
			.get(webservice + '/damaged_road/' + latitude + '/' + longitude)
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

	showModal(selected_segment) {
		this.setState({ modalVisible: true, selected_segment })
	}

	hideModal() {
		this.setState({ modalVisible: false })
	}

	render() {
		return (
			<Fragment>
				<Map onPositionChange={coordinate => this.updateCoordinate(coordinate)}>
					<Polylines
						damaged_segments={this.state.damaged_segments}
						onPress={segment => this.showModal(segment)}
					/>
				</Map>

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
