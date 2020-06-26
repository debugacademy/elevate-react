import React from 'react';

export default function SimpleErrorMessage ({ error, style }) {
  return (
    <div style={style}>
      <h1>Error: {error.name}</h1>
      <p>More info: {error.message}</p>
    </div>
  )
};
