import React from 'react';
import ReactDOM from 'react-dom';
import Slider from 'rc-slider';

// Integer fields when being "displayed" (view mode)
var integerFields = document.getElementsByClassName(['react-field-integer']);
Array.prototype.map.call(integerFields, function(element) {
  // Create a slider representing this field's value
//    value: parseInt(element.textContent),
var DisabledSlider = React.createElement(Slider, {
    value: parseInt(element.getAttribute('content') ?? element.textContent),
    min: parseInt(element.getAttribute('field_min')) ?? 0,
    max: parseInt(element.getAttribute('field_max')) ?? 100,
    disabled: true
  });
  // Render the slider in place of the original integer element
  ReactDOM.render(DisabledSlider, element);

});

// Add a slider to control integer form widgets
var integerFormFieldWrappers = document.getElementsByClassName(['react-field-form-integer']);
Array.prototype.map.call(integerFormFieldWrappers, function(element, i) {
  var integerFormElements = element.getElementsByClassName('form-number');
  var integerFormElement = integerFormElements[0];
  // Check if the integerFormElement has min and max set
  // If not, then using a slider wouldn't make much sense.
  /*  Students: fix the "if" statement  */

  if (integerFormElement.hasAttribute('min') && integerFormElement.hasAttribute('max')) {
    let min = parseInt(integerFormElement.getAttribute('min'));
    let max = parseInt(integerFormElement.getAttribute('max'));
    let value = integerFormElement.getAttribute('value') ? parseInt(integerFormElement.getAttribute('value')) : 0;
    let step = parseInt(integerFormElement.getAttribute('step'));

    integerFormElement.oninput = renderSlider;

    function updateInputValue(sliderValue) {
      integerFormElement.value = parseInt(sliderValue);
      renderSlider();
    }

    function renderSlider(event, inputValue) {
      let SlideComponent = React.createElement(Slider, {
        value: integerFormElement.value ? parseInt(integerFormElement.value) : 0,
        min: min,
        max: max,
        step: step,
        onChange: updateInputValue,
        key: i
      });
      let renderLocation = element.getElementsByClassName('react-widget')[0];
      ReactDOM.render(SlideComponent, renderLocation);
    }
    renderSlider();
  }
});

