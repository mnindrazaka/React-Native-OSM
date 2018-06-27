import React, { Component } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native"
import Icon from "react-native-vector-icons/MaterialCommunityIcons"

class SelectedSegments extends Component {
	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={() => this.props.onClearButtonPress()}>
					<Icon
						name={"close-circle"}
						size={30}
						color={"#EF3C49"}
						style={styles.icon}
					/>
				</TouchableOpacity>
				<View style={styles.data}>
					<Icon name={"road-variant"} size={30} />
					<Text style={styles.num}>{this.props.count + " Selected"}</Text>
				</View>
				<Button title="Edit" onPress={() => this.props.onSubmitButtonPress()} />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 15
	},
	data: {
		flexDirection: "row"
	},
	num: {
		fontSize: 16
	},
	icon: {
		marginRight: 15
	}
})

export default SelectedSegments
