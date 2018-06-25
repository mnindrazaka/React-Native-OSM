import React, { Component } from "react"
import { View, Text, StyleSheet } from "react-native"
import AppWithRoute from "./src/index"

export default class App extends Component {
	render() {
		return (
			<View style={styles.container}>
				<AppWithRoute />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		height: "100%"
	}
})
