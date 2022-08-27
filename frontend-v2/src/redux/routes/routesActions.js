import { UPDATE_ROUTES } from './routesTypes'

export const updateRoutes = (payload) => {
    return {
        type: UPDATE_ROUTES,
        payload: payload
    }
}