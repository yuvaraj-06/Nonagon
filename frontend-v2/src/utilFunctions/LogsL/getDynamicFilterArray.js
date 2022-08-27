import { getUniqueValuesFromArray } from 'utilFunctions/getUniqueValuesFromArray';

export const getFilterArrayForDropDown = (filterParameter, logsData) => {
    let a = logsData.map(element => {
        return (element[filterParameter]);
    })
    return ['No Filter'].concat(getUniqueValuesFromArray(a)).filter(x => x !== undefined);
}