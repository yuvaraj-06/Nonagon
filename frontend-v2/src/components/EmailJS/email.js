import emailjs, { init } from 'emailjs-com';
init("user_D49oGcTjmZrszYCOQCiLS");

export const sendEmail = (jsonObject) => {
    return emailjs.send("service_hwe5ezo", "template_yo12qos", { ...jsonObject })
}

export const sendRequestNewFeaturesEmail = (jsonObject) => {
    return emailjs.send("service_hwe5ezo", "template_sswo2dn", { ...jsonObject });
}