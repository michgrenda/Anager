import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";

const DateInput = (props) => {
  // States
  const [startDate, setStartDate] = useState(null);

  // References
  const dateInput = useRef(null);

  // Close calendar
  const handleDateClickOutside = (el) => {
    if (el.current.input.value === "") props.clickOutside();
  };

  // Control form input
  const handleDateChange = (date) => {
    props.onChange(date);
    setStartDate(date);
  };

  return (
    <DatePicker
      className={props.className}
      selected={startDate}
      placeholderText=""
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      onChange={handleDateChange}
      onClickOutside={handleDateClickOutside.bind(null, dateInput)}
      autoComplete="off"
      name="date"
      ref={dateInput}
    />
  );
};

DateInput.propTypes = {
  className: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  clickOutside: PropTypes.func.isRequired,
};

export default DateInput;
