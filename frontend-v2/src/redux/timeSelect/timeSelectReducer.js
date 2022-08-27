import { DAY, WEEK, MONTH, YESTERDAY } from './timeSelectTypes'
import { initialStateValues } from '../initialStateValues'

const initialState = {
    time: initialStateValues.time
}

const timeSelectReducer = (state = initialState, action) => {
    switch (action.type) {
        case DAY:
            localStorage.setItem('time', 'day')
            return {
                ...state,
                time: 'day'
            }
        case YESTERDAY:
            localStorage.setItem('time', 'yesterday')
            return {
                ...state,
                time: 'yesterday'
            }
        case WEEK:
            localStorage.setItem('time', 'week')
            return {
                ...state,
                time: 'week'
            }
        case MONTH:
            localStorage.setItem('time', 'month')
            return {
                ...state,
                time: 'month'
            }
        default: return state
    }
}

export default timeSelectReducer