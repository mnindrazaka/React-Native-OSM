import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import Geolocation from './src/components/Geolocation'
import AppWithRoute from './src/index'
import Context from './src/context'
import Loading from './src/components/Loading'

export default class App extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Geolocation>
					<Context.Consumer>
						{({ loading }) =>
							loading ? <Loading visible={true} /> : <AppWithRoute />
						}
					</Context.Consumer>
				</Geolocation>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: '100%'
	}
})
