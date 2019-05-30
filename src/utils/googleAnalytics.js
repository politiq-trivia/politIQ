import ReactGA from 'react-ga';

export const trackEvent = (category, action, label) => {
    ReactGA.event({
        category,
        action,
        label
    })
}