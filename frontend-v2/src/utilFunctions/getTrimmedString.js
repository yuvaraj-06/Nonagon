export const getTrimmedString = (string, trimLength) => {
    // string.toString()
    var trimmedString = string.length > trimLength ?
        string.substring(0, trimLength - 3) + "..." :
        string;
    return trimmedString
}