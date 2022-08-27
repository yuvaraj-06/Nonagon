const getFlatArray = (obj) => {
    var f = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            var val = obj[key];
            if (Array.isArray(val)) {
                for (var j in val) {
                    for (var k in j) {
                        if (typeof val[j[k]] != "undefined") f.push(val[j[k]]);
                    }
                }
            } else {
                if (typeof val != "undefined") {
                    f.push(val);
                }
            }
        }
    }
    return f;
}

export default getFlatArray