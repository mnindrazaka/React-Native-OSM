import React, { Component } from 'react'
import { Text } from 'react-native'
import PropTypes from 'prop-types'
import Spinner from 'react-native-loading-spinner-overlay'

export default class Loading extends Component {
	render() {
		return this.props.visible ? <Text>Loading...</Text> : null
		// <Spinner
		// 	visible={this.props.visible}
		// 	overlayColor="rgb(0, 131, 235)"
		// 	textContent={this.props.text}
		// 	textStyle={{ color: "#FFF" }}
		// />
	}
}

Loading.propTypes = {
	visible: PropTypes.bool.isRequired
}
