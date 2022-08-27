export const getStreamButtonList = (noOfCams) => {
    let cams = [
        { value: 'cam1', text: "Camera 1" },
        { value: 'cam2', text: "Camera 2" },
        { value: 'cam3', text: "Camera 3" },
        { value: 'cam4', text: "Camera 4" }
    ]
    return cams.slice(0, noOfCams)
}