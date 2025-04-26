import React from 'react';
import PropTypes from 'prop-types';
import './TabPanel.css';

/**
 * TabPanel component for the tabbed interface
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {number} props.value - Current active tab value
 * @param {number} props.index - This tab's index value
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`friends-tabpanel-${index}`}
      aria-labelledby={`friends-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div className="tab-panel-container">
          {children}
        </div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default TabPanel; 