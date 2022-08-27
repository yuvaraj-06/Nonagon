// import { services } from '../ApiURL'
import store from '../redux/store'
import { updateRoutes } from 'redux/routes/routesActions'
import { getRoutesArray } from './routesArray'
import jwt_decode from 'jwt-decode'

let storeAct = store.getState().act.act;

let routes = getRoutesArray(jwt_decode(storeAct).services)
store.dispatch(updateRoutes(routes))
export default routes;