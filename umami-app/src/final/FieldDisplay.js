import React from 'react';

const fieldWrapperStyle = {
  marginTop: '16px',
  marginBottom: '8px',
  position: 'relative',
  padding: '10px 5px',
  display: 'inline-block',
  minWidth: '100px',
  margin: '4px 10px 15px'

}
const fieldBorderStyle = {
  borderColor:  '#2196f3',
  top:         '0px',
  left: 0,
  right: 0,
  bottom: 0,
  margin: 0,
  padding: 0,
  position: 'absolute',
  transition: 'padding-left 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,border-color 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms,border-width 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
  borderStyle: 'solid',
  borderWidth: '1px',
  borderRadius: '4px',
  pointerEvents: 'none',
  height: '100%',
  width: '100%'

};

const fieldLabelStyle = {
  transform: 'translate(-8px, -6px) scale(0.75)',
  position: 'absolute',
  top: '-4px',
  left: '6px',
  padding: '2px 4px',
  whiteSpace: 'nowrap'
};

const FieldDisplay = ({fieldLabel = null, fieldValue}) => {
  return (
  <div className="field-wrapper" style={fieldWrapperStyle}>
    <div style={fieldBorderStyle}></div>
    { fieldLabel && <span className="label" style={fieldLabelStyle}>{fieldLabel}</span> }
    <span className="value">{fieldValue}</span>
  </div>
  );
}

export default FieldDisplay;
