import React from 'react';
import styled from 'styled-components';

const Svg = styled.svg`
  @keyframes spinners-react-dotted-shrink {
    50% {
      transform: translate(0, 0);
      opacity: 0;
    }
  }
`;

const Loading = () => {
  return (
    <Svg
      fill="none"
      viewBox="0 0 66 66"
      style={{ color: '#e1aa00', overflow: 'visible' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="33"
        cy="33"
        fill="currentColor"
        r="3"
        style={{
          transform: 'translate(22px, -20px)',
          animation: '2s cubic-bezier(0, 0.9, 0, 0.9) 0s infinite normal none running spinners-react-dotted-shrink',
        }}
      ></circle>
      <circle
        cx="33"
        cy="33"
        fill="currentColor"
        r="3"
        style={{
          transform: 'translate(29px)',
          animation: '2s cubic-bezier(0, 0.9, 0, 0.9) 0.1s infinite normal none running spinners-react-dotted-shrink',
        }}
      ></circle>
      <circle
        cx="33"
        cy="33"
        fill="currentColor"
        r="3"
        style={{
          transform: 'translate(22px, 20px)',
          animation: '2s cubic-bezier(0, 0.9, 0, 0.9) 0.2s infinite normal none running spinners-react-dotted-shrink',
        }}
      ></circle>
      <circle
        cx="33"
        cy="33"
        fill="currentColor"
        r="3"
        style={{
          transform: 'translate(0px, 30px)',
          animation: '2s cubic-bezier(0, 0.9, 0, 0.9) 0.3s infinite normal none running spinners-react-dotted-shrink',
        }}
      ></circle>
      <circle
        cx="33"
        cy="33"
        fill="currentColor"
        r="3"
        style={{
          transform: 'translate(-23px, 20px)',
          animation: '2s cubic-bezier(0, 0.9, 0, 0.9) 0.4s infinite normal none running spinners-react-dotted-shrink',
        }}
      ></circle>
      <circle
        cx="33"
        cy="33"
        fill="currentColor"
        r="3"
        style={{
          transform: 'translate(-30px)',
          animation: '2s cubic-bezier(0, 0.9, 0, 0.9) 0.5s infinite normal none running spinners-react-dotted-shrink',
        }}
      ></circle>
      <circle
        cx="33"
        cy="33"
        fill="currentColor"
        r="3"
        style={{
          transform: 'translate(-23px, -20px)',
          animation: '2s cubic-bezier(0, 0.9, 0, 0.9) 0.6s infinite normal none running spinners-react-dotted-shrink',
        }}
      ></circle>
      <circle
        cx="33"
        cy="33"
        fill="currentColor"
        r="3"
        style={{
          transform: 'translate(0px, -30px)',
          animation: '2s cubic-bezier(0, 0.9, 0, 0.9) 0.7s infinite normal none running spinners-react-dotted-shrink',
        }}
      ></circle>
    </Svg>
  );
};

export default Loading;
