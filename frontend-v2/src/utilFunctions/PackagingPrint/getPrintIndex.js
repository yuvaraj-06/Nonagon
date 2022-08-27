export const getPrintIndex = (jsonData) => {
    let { bag_print_true, bag_print_false } = jsonData;
    let a = (bag_print_true / (bag_print_true + bag_print_false)) * 5
    if (isNaN(a)) {
        return 0
    } else {
        return a;
    }
}