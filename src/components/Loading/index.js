import React, { Component } from "react"
import Spinner from "react-native-loading-spinner-overlay"

export default class Loading extends Component {
	render() {
		return (
			<Spinner
				visible={this.props.visible}
				overlayColor="rgb(0, 131, 235)"
				textContent={this.props.text}
				textStyle={{ color: "#FFF" }}
			/>
		)
	}
}
