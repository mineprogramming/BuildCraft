type BoxPoints = {
	start: Vector;
	end: Vector
}

class AxisBoxes {

	public static get X(): BoxPoints {
		return {
			start: {
				x: 0,
				y: -1,
				z: -1
			},
			end: {
				x: 1,
				y: 2,
				z: 2
			}
		}
	}

	public static get Y(): BoxPoints {
		return {
			start: {
				x: -1,
				y: 0,
				z: -1
			},
			end: {
				x: 2,
				y: 1,
				z: 2
			}
		}
	}

	public static get Z(): BoxPoints {
		return {
			start: {
				x: -1,
				y: -1,
				z: 0
			},
			end: {
				x: 2,
				y: 2,
				z: 1
			}
		}
	}
}