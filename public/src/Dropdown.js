import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';

const Dropdown = ({ items, selectedItem, setSelectedItem }) => {
  return (
    <Select
      className="react-select-container"
      classNamePrefix="react-select"
      value={selectedItem}
      onChange={({ value }) => setSelectedItem(Number(value))}
      options={items}
      menuPlacement="top"
      styles={{
        menu: base => ({
          ...base,
          zIndex: 100
        })
      }}
    />
  );
};

Dropdown.propTypes = {
  selectedItem: PropTypes.any,
  items: PropTypes.any,
  setSelectedItem: PropTypes.any
};

export default Dropdown;
