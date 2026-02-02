export default function NavItem({
  selectedTab,
  icon,
  alt,
  title,
  onClickHandler,
  count,
}) {
  return (
    <div
      className={`nav-icon-content ${selectedTab ? "nav-bar-selected" : ""}`}
      onClick={() => onClickHandler()}
    >
      <div className="nav-bar-icon-count-container">
        <img className="nav-bar-icon " src={icon} alt={alt} />
        {count > 0 && (
          <span className="nav-bar-message-count-container">
            <span className="nav-bar-message-count">{count}</span>
          </span>
        )}
      </div>
      <span>{title}</span>
    </div>
  );
}
