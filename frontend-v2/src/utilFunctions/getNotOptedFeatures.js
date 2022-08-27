const uniqueFeatures = (setA, setB) => {
    setB = new Set(setB)
    let _difference = new Set(setA)
    for (let elem of setB) {
        _difference.delete(elem)
    }
    return _difference
}

export const getNotOptedFeatures = (sector, setA, setB) => {
    let a = setA[sector]
    return Array.from(uniqueFeatures(a ? a : setA, setB));
}