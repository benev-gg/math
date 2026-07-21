
export type XyArray = [x: number, y: number]
export type XyzArray = [x: number, y: number, z: number]
export type XyzwArray = [x: number, y: number, z: number, w: number]

export type Mat4Array = [
	number, number, number, number,
	number, number, number, number,
	number, number, number, number,
	number, number, number, number,
]

/** @deprecated renamed to XyArray */
export type Tuple2 = XyArray

/** @deprecated renamed to XyzArray */
export type Tuple3 = XyzArray

/** @deprecated renamed to XyzwArray */
export type Tuple4 = XyzwArray

/** @deprecated renamed to Mat4Array */
export type Tuple16 = Mat4Array

