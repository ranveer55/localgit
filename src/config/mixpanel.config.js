import mixpanel from 'mixpanel-browser';

mixpanel.init('59bae692077ad0378690050996ef40c9');
let envCheck = process.env.NODE_ENV === 'production';
let actions = {
    identify: (id) => {
        if (envCheck) mixpanel.identify(id);
    },
    alias: (id) => {
        if (envCheck) mixpanel.alias(id);
    },
    track: (eventName, props) => {
        if (envCheck) mixpanel.track('InterviewPrep.' + eventName, props);
    },
    people: {
        set: (props) => {
            if (envCheck) mixpanel.people.set(props);
        },
    },
};

export let mixPanel = actions;