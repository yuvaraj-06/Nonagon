import { initialStateValues } from 'redux/initialStateValues'
import { UPDATE_COMPANY_SERVICES_DATA } from './outletServicesTypes'

const initialState = {
    companyServices: initialStateValues.companyServices
}

const serviceReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_COMPANY_SERVICES_DATA:
            return {
                ...state,
                companyServices: action.payload
            }
        default: return state
    }
}

export default serviceReducer