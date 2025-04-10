import React from 'react';
import ReactGA from 'react-ga4';

export const trackPageView = (pageTitle) => {
  ReactGA.send({ 
    hitType: "pageview", 
    page: window.location.pathname,
    title: pageTitle
  });
};

export const trackEvent = (category, action, label, value = 1) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
    value: value
  });
};

export const trackTiming = (category, variable, value) => {
  ReactGA.timing({
    category: category,
    variable: variable,
    value: value
  });
};

// Composant pour wrapper les éléments trackés
export const TrackedComponent = ({ children, eventName, eventData }) => {
  const handleClick = (e) => {
    trackEvent('UI_Interaction', eventName, JSON.stringify(eventData));
    if (children.props.onClick) {
      children.props.onClick(e);
    }
  };

  return React.cloneElement(children, { onClick: handleClick });
};