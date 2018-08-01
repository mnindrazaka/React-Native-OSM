import React, { Component, Fragment } from 'react'
import { Modal, Button } from 'react-native'

import Map from '../../components/Map'
import Polylines from './components/Polylines'
import SegmentDetail from './components/SegmentDetail'

import { webservice } from '../../config/api'
import axios from 'axios'
import { getDistanceFrom } from '../../utility/distance'
import { withNavigationFocus } from 'react-navigation'

import Context from '../../context'

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
		const distance = getDistanceFrom(current_coordinate, this.state)

		if (this.state.latitude === null || distance > 50) {
			await this.setCoordinate(current_coordinate)
			this.loadDamagedSegments()
		}
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
			<Context.Consumer>
				{({ latitude, longitude }) => {
					this.updateCoordinate({ latitude, longitude })
					return (
						<Fragment>
							<Map>
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
				}}
			</Context.Consumer>
		)
	}
}

export default withNavigationFocus(ViewRoad)
