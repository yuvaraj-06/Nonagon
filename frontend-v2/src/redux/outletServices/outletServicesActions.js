import { UPDATE_COMPANY_SERVICES_DATA } from './outletServicesTypes'

export const updateCompanyServices = (payload) => {
    return {
        type: UPDATE_COMPANY_SERVICES_DATA,
        payload: payload
    }
}