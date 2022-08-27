import { DAY, WEEK, MONTH, YESTERDAY } from './timeSelectTypes'

export const updateTimeSelect = (payload) => {
    if (payload === 'day') {
        return {
            type: DAY
        }
    } else if (payload === 'yesterday') {
        return {
            type: YESTERDAY
        }
    }
    else if (payload === 'week') {
        return {
            type: WEEK
        }
    } else if (payload === 'month') {
        return {
            type: MONTH
        }
    }
}