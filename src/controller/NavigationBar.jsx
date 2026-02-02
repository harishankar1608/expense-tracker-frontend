import NavItem from "../component/Navigation/NavigationItem";
import { useAuth } from "../context/AuthContext";
import { useChat } from "../context/ChatContext";

export const NavigationBar = (props) => {
  const { currentTab, setCurrentTab, setLogoutPopup } = props;

  const { username } = useAuth();
  const { unreadMessages } = useChat();

  return (
    <div className="nav-bar-container">
      <div className="nav-welcome-user">
        <span>Hello {username.split(" ")?.[0] || ""}!</span>
      </div>
      <div className="nav-bar-icon-container font-bold">
        <NavItem
          selectedTab={currentTab === 1}
          icon={"/expense-list-icon.svg"}
          alt={"expense list icon"}
          title={"Expenses"}
          onClickHandler={() => setCurrentTab(1)}
        />
        <NavItem
          selectedTab={currentTab === 2}
          icon={"/expense-list-icon.svg"}
          alt={"Spending icon"}
          title={"Spendings"}
          onClickHandler={() => setCurrentTab(2)}
        />
        <NavItem
          selectedTab={currentTab === 3}
          icon={"/friend-request-icon.svg"}
          alt={"friend request icon"}
          title={"Requests"}
          onClickHandler={() => setCurrentTab(3)}
        />
        <NavItem
          selectedTab={currentTab === 4}
          icon={"/messages-icon.svg"}
          alt={"messages icon"}
          title={"Messages"}
          onClickHandler={() => setCurrentTab(4)}
          count={unreadMessages}
        />
        <div
          className={`nav-icon-content`}
          onClick={() => setLogoutPopup(true)}
        >
          <img className="nav-bar-icon" src="/logout.svg" alt="logout icon" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};
