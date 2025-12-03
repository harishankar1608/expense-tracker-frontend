export default function Dropdown(props) {
  const { dropdownValues, selectedValue, handleChange, type, setDropdown } =
    props;
  const handleSelection = (value) => {
    handleChange(value, type);
    setDropdown(null);
  };

  return (
    <div className="dropdown-container">
      {dropdownValues.map((value, index) => (
        <div
          onClick={() => handleSelection(value)}
          className={`dropdown-list ${
            selectedValue === value ? "dropdown-list-selected" : ""
          }`}
          key={value}
        >
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}
