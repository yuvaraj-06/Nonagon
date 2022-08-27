import { DAY } from './timeSelect/timeSelectTypes'
import { DashboardTab, SupportTab } from '../routes/routesContent'
import jwt_decode from 'jwt-decode'

export const initialStateValues = {
    act: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGNoZWVyc2xpcXVvci5jb20iLCJlbWFpbCI6InVzZXJAY2hlZXJzbGlxdW9yLmNvbSIsIm5hbWUiOiJDaGVlcnMgTGlxb3VyIFVzZXIiLCJjb21wYW55IjoiQ2hlZXJzIExpcW91ciIsIm91dGxldCI6IkNSTFFSLUhTR0ZMVVMwMDEiLCJwb3NpdGlvbiI6IkFkbWluIiwicm9sZSI6Im91dGxldF91c2VyIiwiaW5pdGlhbF9sb2dpbiI6ZmFsc2UsImV4cCI6MTYyMDMyMzIzNn0.DaGU76B63UOR5G2eB-ldSGZBXEvkLhWvG5cUl',
    time: localStorage.getItem('time') ? localStorage.getItem('time') : DAY,
    routes: [
        DashboardTab,
        SupportTab
    ],
    outletCode: "0xa79e63e78eec28741e711f89a672a4c40876ebf3",
    outletCameraDetails: {
        "cam_full": "All Cameras",
        "cam_1": "Retail Area",
        "cam_2": "Front Door",
        "cam_3": "Kitchen Area",
        "cam_4": "Billing Counter",
    },
    outletTimezone: null,
    companyServices: {
        "XYZ0001-S0001": {
            "outlet_code": "XYZ0001-S0001",
            "outlet_location": "New York City, USA",
            "services": [
                "KPPE.HD",
                "KPPE.FMD",
                "KPPE.HD"
            ],
            "timezone": "America/New_York",
            "meta": {
                "cam_1": "KPPE.HD",
                "cam_2": "KPPE.FMD",
                "cam_3": "KPPE.GD"
            },
            "rtmp_stream": "rtmp://164.52.206.31/"
        },
    }
}