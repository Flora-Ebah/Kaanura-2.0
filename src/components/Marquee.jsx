import React from 'react';
import PropTypes from 'prop-types';

export function Marquee({
  className = "",
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ...props
}) {
  return (
    <div
      {...props}
      className={`group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)] ${
        vertical ? "flex-col" : "flex-row"
      } ${className}`}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={`flex shrink-0 justify-around [gap:var(--gap)] ${
              vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row"
            } ${pauseOnHover ? "group-hover:[animation-play-state:paused]" : ""} ${
              reverse ? "[animation-direction:reverse]" : ""
            }`}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

// Définition des PropTypes
Marquee.propTypes = {
  className: PropTypes.string,
  reverse: PropTypes.bool,
  pauseOnHover: PropTypes.bool,
  children: PropTypes.node.isRequired,
  vertical: PropTypes.bool,
  repeat: PropTypes.number,
}; 