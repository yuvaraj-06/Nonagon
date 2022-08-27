//replace a substring with another string
export const getReplacedString = (str, replace, with_this) => {
    console.log(str, replace, with_this);
    var s = str.replace(replace, with_this);
    return s;
}