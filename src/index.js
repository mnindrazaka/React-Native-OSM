import { createStackNavigator } from "react-navigation"
import ViewRoad from "./scenes/ViewRoad"
import EditRoad from "./scenes/EditRoad"
import FormEditSegments from "./scenes/FormEditSegments"

export default createStackNavigator({
	ViewRoad,
	EditRoad,
	FormEditSegments
})
