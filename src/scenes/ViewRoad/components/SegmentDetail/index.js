import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import PropTypes from 'prop-types'

class SegmentDetail extends Component {
	renderItem(label, value, icon) {
		return (
			<View style={styles.item}>
				<View style={styles.itemIcon}>
					<Icon name={icon} size={30} />
				</View>
				<View style={styles.itemData}>
					<Text style={styles.itemLabel}>{label}</Text>
					<Text style={styles.itemValue}>{value}</Text>
				</View>
			</View>
		)
	}

	render() {
		const { segment } = this.props
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Segment Detail</Text>
				{this.renderItem(
					'Damage Type',
					segment.damage_type.name,
					'road-variant'
				)}
				{this.renderItem(
					'Damage Level',
					segment.damage_level.name,
					'signal-cellular-2'
				)}
				{this.renderItem('Information', segment.information, 'information')}
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		paddingTop: 20
	},
	title: {
		fontSize: 25,
		textAlign: 'center'
	},
	item: {
		flexDirection: 'row',
		marginTop: 20
	},
	itemIcon: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	itemData: {
		flex: 3
	},
	itemLabel: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	itemValue: {
		fontSize: 16
	}
})

SegmentDetail.propTypes = {
	segment: PropTypes.object.isRequired
}

export default SegmentDetail
