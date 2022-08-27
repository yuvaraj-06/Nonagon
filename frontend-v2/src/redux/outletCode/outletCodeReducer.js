import { initialStateValues } from 'redux/initialStateValues'
import { UPDATE_OUTLET_CODE, UPDATE_OUTLET_CAMERA_DETAILS } from './outletCodeTypes'

const initialState = {
    outletCode: initialStateValues.outletCode,
    outletCameraDetails: initialStateValues.outletCameraDetails,
    outletTimezone: initialStateValues.outletTimezone
}

const outletReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_OUTLET_CODE:
            return {
                ...state,
                outletCode: action.payload.outletCode,
                outletTimezone: action.payload.outletTimezone ? action.payload.outletTimezone : null
            }
        case UPDATE_OUTLET_CAMERA_DETAILS:
            return {
                ...state,
                outletCameraDetails: action.payload.outletCameraDetails,
                outletTimezone: action.payload.outletTimezone
            }
        default: return state
    }
}

export default outletReducer