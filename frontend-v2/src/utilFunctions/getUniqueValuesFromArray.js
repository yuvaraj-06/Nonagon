export const getUniqueValuesFromArray = (arr) => {
    return arr.filter((item, i, ar) => ar.indexOf(item) === i);
}