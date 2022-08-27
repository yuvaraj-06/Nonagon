import { initialStateValues } from 'redux/initialStateValues'
import { UPDATE_ACT } from './actTypes'

const initialState = {
    act: localStorage.getItem('act') ? localStorage.getItem('act')
        :
        initialStateValues.act
}

const actReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ACT:
            return {
                ...state,
                act: action.payload,
            }
        default: return state
    }
}

export default actReducer