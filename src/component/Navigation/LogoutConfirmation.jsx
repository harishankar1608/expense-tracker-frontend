import { useAuth } from "../../context/AuthContext";

export default function ({ closePopup }) {
  const { handleLogout } = useAuth();

  return (
    <div className="logout-overlay">
      <div className="logout-popup-container">
        <span className="logout-confirmation-message">
          Are you sure you want to logout?
        </span>
        <div className="logout-button-container">
          <button onClick={() => handleLogout()}>Yes</button>
          <button onClick={() => closePopup()}>No</button>
        </div>
      </div>
    </div>
  );
}
