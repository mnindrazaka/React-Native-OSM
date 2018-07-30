import React, { Component } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import PropTypes from 'prop-types'

class SelectedSegments extends Component {
	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={() => this.props.onClearButtonPress()}>
					<Icon name={'close-circle'} size={30} color={'#EF3C49'} />
				</TouchableOpacity>

				<View style={styles.data}>
					<View style={styles.dataRow}>
						<Icon name={'road-variant'} size={25} style={styles.icon} />
						<Text style={styles.num}>{this.props.count + ' Selected'}</Text>
					</View>

					<View style={styles.dataRow}>
						<Icon name={'arrow-expand'} size={25} style={styles.icon} />
						<Text style={styles.num}>
							{this.props.segmentLength.toFixed(1) + ' Meter'}
						</Text>
					</View>
				</View>

				<Button title="Edit" onPress={() => this.props.onSubmitButtonPress()} />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: 'row',
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 15
	},
	data: {
		flexDirection: 'column'
	},
	dataRow: {
		flex: 1,
		flexDirection: 'row'
	},
	num: {
		fontSize: 16
	},
	icon: {
		marginRight: 15
	}
})

SelectedSegments.propTypes = {
	onClearButtonPress: PropTypes.func.isRequired,
	onSubmitButtonPress: PropTypes.func.isRequired,
	count: PropTypes.number.isRequired,
	segmentLength: PropTypes.number.isRequired
}

export default SelectedSegments
