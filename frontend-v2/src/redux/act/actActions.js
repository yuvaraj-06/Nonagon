import { UPDATE_ACT } from './actTypes'

export const updateAct = (payload) => {
    return {
        type: UPDATE_ACT,
        payload: payload
    }
}