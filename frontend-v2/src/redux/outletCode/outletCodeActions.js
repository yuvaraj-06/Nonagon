import { UPDATE_OUTLET_CODE, UPDATE_OUTLET_CAMERA_DETAILS } from './outletCodeTypes'

export const updateOutletCode = (payload) => {
    return {
        type: UPDATE_OUTLET_CODE,
        payload: payload
    }
}

export const updateOutletCameraDetails = (payload) => {
    return {
        type: UPDATE_OUTLET_CAMERA_DETAILS,
        payload: payload
    }
}