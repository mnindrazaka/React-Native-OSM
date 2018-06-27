import React, { Component, Fragment } from "react"
import { Button, Text } from "react-native"
import t from "tcomb-form-native"
const Form = t.form.Form
import { webservice } from "../../config/api"
import axios from "axios"

export default class SegmentDetail extends Component {
	static navigationOptions = {
		title: "Segment Detail"
	}

	constructor(props) {
		super(props)
		const navigation = this.props.navigation
		this.state = {
			damage_type: [],
			damage_level: [],
			value: {
				information: navigation.getParam("information", ""),
				damage_type_id: navigation.getParam("damage_type_id", ""),
				damage_level_id: navigation.getParam("damage_level_id", "")
			}
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

	onChange(value) {
		console.log("form value : ", value)
		this.setState({ value })
	}

	async onSubmit() {
		const value = this.refs.form.getValue()
		if (value) {
			const osm_id = this.props.navigation.getParam("osm_id")
			const sid = this.props.navigation.getParam("sid")
			await axios
				.put(webservice + `/damaged_road/${osm_id}/${sid}`, value)
				.then(response => response)
			this.props.navigation.navigate("ViewRoad")
		}
	}

	render() {
		console.log(this.state)
		return (
			<Fragment>
				<Form
					ref="form"
					type={this.createModel()}
					value={this.state.value}
					onChange={value => this.onChange(value)}
				/>
				<Button title="Submit" onPress={() => this.onSubmit()} />
			</Fragment>
		)
	}
}
