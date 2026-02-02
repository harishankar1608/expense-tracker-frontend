import { useEffect, useState } from "react";
import AddNewExpense from "../component/AddExpense/AddNewExpense";
import { useAuth } from "../context/AuthContext";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function Spendings() {
  const { userId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  const [expenses, setExpenses] = useState([]);
  const [totalSelfExpense, setTotalSelfExpense] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState("");

  const getExpenses = async (selectedMonth) => {
    try {
      const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const response = await fetch(
        `${backendUrl}/get-self-expenses?currentUser=${userId}&selectedMonth=${selectedMonth}&currentTimezone=${currentTimezone}`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok) throw new Error("Error while getting user data");

      const data = await response.json();
      setExpenses(data?.expenses ?? []);
    } catch (error) {
      console.log(error, "error...");
    }
  };

  const handleDateSelection = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleExpenseChange = (month, expense) => {
    if (month === selectedMonth)
      setExpenses((prevValue) => [...prevValue, expense]);
  };

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString("en-CA", {
      month: "2-digit",
      year: "numeric",
    });

    setSelectedMonth(currentDate);
  }, []);

  useEffect(() => {
    if (selectedMonth) getExpenses(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    // if (expenses.length === 0) return;

    const totalSpendings = expenses.reduce(
      (total, expense) => total + Number(expense.amount),
      0
    );
    setTotalSelfExpense(totalSpendings);
  }, [expenses]);

  return (
    <div className="expense-list-container">
      <div className="expense-list-header-container">
        <div className="expense-list-header">
          <span className="font-bold">Total Savings</span>
          <span
            className={`${
              totalSelfExpense > 0 ? "font-green" : "font-red"
            } font-bold`}
          >
            {totalSelfExpense}
          </span>
        </div>

        <input
          type="month"
          className="expense-list-date-picker"
          value={selectedMonth}
          onChange={handleDateSelection}
        />
      </div>

      {expenses.length > 0 ? (
        <>
          {expenses.map((expense, index) => (
            <div className="expense-list-card" key={expense.expense_id}>
              <div className="expense-list-card-serial">{index + 1}</div>
              <div className="expense-list-card-name">
                <span className="text-left">{expense?.category || ""}</span>
              </div>
              <div className="expense-list-card-amount">
                <span
                  className={`${
                    expense.amount > 0 ? "font-green" : "font-red"
                  } font-bold`}
                >
                  {expense.amount}
                </span>
              </div>
              <div className="expense-list-card-continue">
                <img
                  className="expense-list-right-arrow"
                  src="/right-arrow-svgrepo-com.svg"
                  alt="Right arrow"
                />
              </div>
            </div>
          ))}
        </>
      ) : (
        <div>No Spendings found</div>
      )}
      <AddNewExpense type="self" handleExpenseChange={handleExpenseChange} />
    </div>
  );
}
