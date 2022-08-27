import mixpanel from 'mixpanel-browser';

// mixpanel deployment details
mixpanel.init('d30078a5c755bfc86c272f9cb007cb5b');
let env_check = process.env.NODE_ENV === 'production';

//mixpanel test project details
// mixpanel.init('7181a4fb0348302fc74ce5b2e3894bc5');
// let env_check = true;
// let env_check = process.env.NODE_ENV === 'production';

let actions = {
    people: {
        set:
            (name, props) => {
                if (env_check) mixpanel.people.set(name, props);
            }
    },
    identify: (id) => {
        if (env_check) mixpanel.identify(id);
    },
    alias: (id) => {
        if (env_check) mixpanel.alias(id);
    },
    track: (name, props) => {
        if (env_check) mixpanel.track(name, props);
    },
    time_event: (name) => {
        if (env_check) mixpanel.time_event(name);
    },
};

export let Mixpanel = actions;