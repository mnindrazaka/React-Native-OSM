import React, { Component, Fragment } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Map from '../../components/Map'
import Polylines from './components/Polylines'
import SelectedSegments from './components/SelectedSegments'

import { webservice } from '../../config/api'
import axios from 'axios'
import geodist from 'geodist'

export default class EditRoad extends Component {
	static navigationOptions = {
		title: 'Edit Road'
	}

	state = {
		segments: [],
		selected_segments: [],
		latitude: null,
		longitude: null
	}

	async updateCoordinate(coordinate) {
		const distance = this.getDistance(coordinate)
		if (this.state.latitude === null || distance > 50) {
			await this.setCoordinate(coordinate)
			this.loadSegments()
			this.updateSelectedSegments([])
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
				unit: 'meters'
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
			.get(webservice + '/road_segment/' + latitude + '/' + longitude)
			.then(response => {
				this.setState({ segments: response.data })
			})
	}

	updateSelectedSegments(segments) {
		this.setState({
			selected_segments: segments
		})
	}

	selectedSegmentLength() {
		let length = 0
		this.state.selected_segments.forEach(function(segment) {
			length += segment['length']
		})
		return length
	}

	navigateToForm() {
		this.props.navigation.navigate('FormEditSegments', {
			segments: this.state.selected_segments
		})
	}

	render() {
		return (
			<Fragment>
				<Map
					style={styles.map}
					onPositionChange={coordinate => this.updateCoordinate(coordinate)}>
					<Polylines
						segments={this.state.segments}
						selected_segments={this.state.selected_segments}
						onSelectedSegmentsChange={segments =>
							this.updateSelectedSegments(segments)
						}
					/>
				</Map>

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
