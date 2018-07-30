import React, { Component, Fragment } from 'react'
import { Polyline } from 'react-native-maps'

class Polylines extends Component {
	segmentColor = {
		default: 'rgba(200, 200, 200, 0.7)',
		selected: 'rgba(0, 0, 0, 0.5)'
	}

	renderPolyline() {
		return this.props.segments.map((segment, index) => {
			const isSelected = this.isSegmentSelected(segment)
			return (
				<Polyline
					key={index}
					coordinates={segment.coordinates}
					strokeColor={
						isSelected ? this.segmentColor.selected : this.segmentColor.default
					}
					strokeWidth={15}
					onPress={() =>
						isSelected
							? this.unselectSegment(segment)
							: this.selectSegment(segment)
					}
				/>
			)
		})
	}

	isSegmentSelected(segment) {
		let selected = false
		this.props.selected_segments.forEach(item => {
			if (item.osm_id === segment.osm_id && item.sid === segment.sid) {
				selected = true
			}
		})
		return selected
	}

	selectSegment(segment) {
		let selected_segments = this.props.selected_segments
		selected_segments.push(segment)
		this.updateSelectedSegments(selected_segments)
	}

	unselectSegment(segment) {
		let selected_segments = this.props.selected_segments.filter(item => {
			return item.osm_id !== segment.osm_id || item.sid !== segment.sid
		})
		this.updateSelectedSegments(selected_segments)
	}

	clearSelectedSegment() {
		this.updateSelectedSegments([])
	}

	updateSelectedSegments(segments) {
		this.props.onSelectedSegmentsChange(segments)
	}

	render() {
		return <Fragment>{this.renderPolyline()}</Fragment>
	}
}

export default Polylines
