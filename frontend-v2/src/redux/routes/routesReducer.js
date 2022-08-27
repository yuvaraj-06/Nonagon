import { initialStateValues } from 'redux/initialStateValues'
import { UPDATE_ROUTES } from './routesTypes'

const initialState = {
    routes: initialStateValues.routes
}

const routesReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_ROUTES:
            return {
                ...state,
                routes: action.payload,
            }
        default: return state
    }
}

export default routesReducer