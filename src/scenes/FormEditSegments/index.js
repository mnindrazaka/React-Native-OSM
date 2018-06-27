import React, { Component, Fragment } from "react"
import { Button, Text, View, StyleSheet } from "react-native"
import t from "tcomb-form-native"
const Form = t.form.Form
import { webservice } from "../../config/api"
import axios from "axios"

export default class FormEditSegments extends Component {
	static navigationOptions = {
		title: "Form Edit Segments"
	}

	constructor(props) {
		super(props)
		const navigation = this.props.navigation
		this.state = {
			damage_type: [],
			damage_level: []
		}
	}

	componentWillMount() {
		this.getDamageData()
	}

	async getDamageData() {
		const damage_type = await fetch(webservice + "/damage_type")
			.then(response => response.json())
			.then(responseJson => responseJson)

		const damage_level = await fetch(webservice + "/damage_level")
			.then(response => response.json())
			.then(responseJson => responseJson)

		this.setState({ damage_type, damage_level })
	}

	createModel() {
		const damage_type = this.generateEnums(this.state.damage_type)
		const damage_level = this.generateEnums(this.state.damage_level)

		return t.struct({
			damage_type_id: damage_type,
			damage_level_id: damage_level,
			information: t.String
		})
	}

	generateEnums(arr) {
		let enumeration = {}
		arr.forEach(item => {
			const label = Object.values(item)[0]
			enumeration[label] = item.name
		})
		return t.enums(enumeration)
	}

	async onSubmit() {
		const value = this.refs.form.getValue()
		if (value) {
			const segments = this.props.navigation.getParam("segments")
			await axios
				.put(webservice + `/damaged_road`, {
					segments,
					value
				})
				.then(response => response)
			this.props.navigation.navigate("ViewRoad")
		}
	}

	render() {
		return (
			<View style={styles.container}>
				<Form ref="form" type={this.createModel()} />
				<Button title="Submit" onPress={() => this.onSubmit()} />
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "white",
		padding: 15
	}
})
