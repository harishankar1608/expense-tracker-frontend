import { useState } from "react";
import { NavigationBar } from "./NavigationBar";
import ExpenseList from "./ExpenseList";
import Request from "./Request";
import Spendings from "./Spendings";
import Messages from "./Messages";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [currentTab, setCurrentTab] = useState(1);
  const { username } = useAuth();

  return (
    <>
      <div className="gray-background dashboard-container">
        <NavigationBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
        <div className="expense-list-header-mobile">
          <span>Hello {username.split(" ")?.[0] || ""}!</span>
        </div>
        {currentTab === 1 && <ExpenseList />}
        {currentTab === 2 && <Spendings />}
        {currentTab === 3 && <Request />}
        {currentTab === 4 && <Messages />}
      </div>
    </>
  );
}
