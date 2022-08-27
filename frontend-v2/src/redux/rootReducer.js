import { combineReducers } from 'redux'
import actReducer from './act/actReducer'
import timeSelectReducer from './timeSelect/timeSelectReducer'
import routesReducer from './routes/routesReducer'
import outletReducer from './outletCode/outletCodeReducer'
import serviceReducer from './outletServices/outletServicesReducer'

const rootReducer = combineReducers({
    act: actReducer,
    time: timeSelectReducer,
    routes: routesReducer,
    outletCode: outletReducer,
    services: serviceReducer
})

export default rootReducer