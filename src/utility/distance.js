import geodist from 'geodist'

function getDistanceFrom(oldCoordinate, newCoordinate) {
	const { latitude: new_latitude, longitude: new_longitude } = newCoordinate
	const { latitude: old_latitude, longitude: old_longitude } = oldCoordinate

	return geodist(
		{
			lat: new_latitude,
			lon: new_longitude
		},
		{
			lat: old_latitude,
			lon: old_longitude
		},
		{
			unit: 'meters'
		}
	)
}

export { getDistanceFrom }
