export default function Dropdown(props) {
  const { dropdownValues, selectedValue, setSelectedValue, setDropdown } =
    props;
  const handleSelection = (value) => {
    setSelectedValue(value);
    setDropdown(null);
  };

  return (
    <div className='dropdown-container'>
      {dropdownValues.map((value, index) => (
        <div
          onClick={() => handleSelection(value)}
          className={`dropdown-list ${
            selectedValue === value ? 'dropdown-list-selected' : ''
          }`}
          key={value}
        >
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}
