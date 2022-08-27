export const getLiveNotificationsOutletArray = (userOutletsAccessList, companyServices) => {
    let a = Object.keys(companyServices)

    let b = []
    for (var i = 0; i < a.length; i++) {
        if (companyServices[a[i]].live_notification
            // && (userOutletsAccessList.indexOf(companyServices[a[i]]) > -1)
        ) {
            b.push(companyServices[a[i]].outlet_code)
        }
    }
    return b
}