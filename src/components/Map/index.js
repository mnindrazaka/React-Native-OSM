import React, { Component, Fragment } from 'react'
import { View } from 'react-native'
import styles from './styles'
import MapWrapper from '../MapWrapper'
import MapView, { UrlTile, Marker } from 'react-native-maps'
import Context from '../../context'

export default class Map extends Component {
	templateURL = 'http://c.tile.openstreetmap.org/{z}/{x}/{y}.png'

	renderMap(latitude, longitude) {
		return (
			<MapWrapper
				latitude={latitude}
				longitude={longitude}
				render={coordinate => (
					<MapView
						zoomEnabled={false}
						mapType="none"
						style={styles.map}
						initialRegion={{
							latitude: coordinate.latitude,
							longitude: coordinate.longitude,
							latitudeDelta: coordinate.latitudeDelta,
							longitudeDelta: coordinate.longitudeDelta
						}}>
						<UrlTile urlTemplate={this.templateURL} zIndex={-3} />

						<Marker
							coordinate={{
								latitude,
								longitude
							}}>
							<View style={styles.markerOutline}>
								<View style={styles.marker} />
							</View>
						</Marker>

						{this.props.children}
					</MapView>
				)}
			/>
		)
	}

	render() {
		return (
			<Context.Consumer>
				{({ latitude, longitude }) => this.renderMap(latitude, longitude)}
			</Context.Consumer>
		)
	}
}
