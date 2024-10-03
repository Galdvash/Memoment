import React from "react";
import styled from "styled-components";

const Button = () => {
  return (
    <StyledWrapper>
      <span className="fancy">
        <span className="top-key" />
        <span className="text">Creat New Event</span>
        <span className="bottom-key-1" />
        <span className="bottom-key-2" />
      </span>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .fancy {
    background-color: #fdfcfc;
    border: 2px solid;
    border-radius: 0;
    box-sizing: border-box;
    color: #000;
    cursor: pointer;
    display: inline-block;
    float: right;
    font-weight: 700;
    letter-spacing: 0.05em;
    margin: 0;
    outline: none;
    overflow: visible;
    padding: 1.25em 2em;
    position: relative;
    text-align: center;
    text-decoration: none;
    text-transform: none;
    transition: all 0.3s ease-in-out;
    user-select: none;
    font-size: 13px;
  }

  .fancy::before {
    content: " ";
    width: 1.5625rem;
    height: 2px;
    background: white;
    top: 50%;
    left: 1.5em;
    position: absolute;
    transform: translateY(-50%);
    transform-origin: center;
    transition: background 0.3s linear, width 0.3s linear;
  }

  .fancy .text {
    font-size: 1.125em;
    line-height: 1.33333em;
    padding-left: 2em;
    display: block;
    text-align: left;
    transition: all 0.6s ease-in-out;
    text-transform: uppercase;
    text-decoration: none;
    color: black;
  }

  .fancy .top-key {
    height: 2px;
    width: 1.5625rem;
    top: 5px;
    left: 0.625rem;
    position: absolute;
    background: #212121;
    transition: width 0.6s ease-out, left 2s ease-out;
  }

  .fancy .bottom-key-1 {
    height: 2px;
    width: 1.5625rem;
    right: 1.875rem;
    bottom: 5px;
    position: absolute;
    background: #e90f0f;
    transition: width 0.8s ease-out, right 0.6s ease-out;
  }

  .fancy .bottom-key-2 {
    height: 2px;
    width: 0.625rem;
    right: 0.625rem;
    bottom: 9px;
    position: absolute;
    background: #212121;
    transition: width 0.5s ease-out, right 0.3s ease-out;
  }

  .fancy:hover {
    color: white;
    background: white;
  }

  .fancy:hover::before {
    width: 0.9375rem;
    background: black;
  }

  .fancy:hover .text {
    color: #e90f0f;
    padding-left: 1.5em;
  }

  .fancy:hover .top-key {
    left: -2px;
    width: 0px;
  }

  .fancy:hover .bottom-key-1,
  .fancy:hover .bottom-key-2 {
    right: 0;
    width: 0;
  }
`;

export default Button;
