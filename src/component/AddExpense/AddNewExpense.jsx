import { useState } from "react";
import SearchFriendList from "./SearchFriendList.jsx";
import Dropdown from "../helpers/Dropdown";
import { validateExpense } from "../../utils/validateExpense";
import { useAuth } from "../../context/AuthContext.jsx";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export default function AddNewExpense({ type, handleExpenseChange }) {
  const { userId } = useAuth();
  const [error, setError] = useState("");
  const [selectedFriend, setSelectedFriend] = useState(null);

  const expenseCategoryList = ["Food", "Snacks", "Fuel", "Shopping", "Movie"];

  const expenseTypeList = ["lended", "borrowed"];

  const selfExpenseTypes = ["spent", "received"];

  const [selfExpenseType, setSelfExpenseType] = useState(selfExpenseTypes[0]);

  const [dropdown, setDropdown] = useState(null);

  const defaultExpenseData = {
    expenseDate: "",
    expenseType: "lended",
    expenseAmount: "",
    expenseCategory: "Food",
    expenseDescription: "",
  };
  const [expenseData, setExpenseData] = useState(defaultExpenseData);

  const [popupOpen, setPopupOpen] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-CA");

  const handleSubmit = async () => {
    /**
     * expenseDate - optional
     * expenseType - required
     * expenseAmount - required
     * expenseCategory - optional
     * expenseDescription - optional
     */

    const isInValid = validateExpense(
      expenseData.expenseAmount,
      expenseData.expenseType,
      selectedFriend
    );

    if (isInValid) return setError(isInValid);

    try {
      const response = await fetch(`${backendUrl}/add-expense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          expenseType: type === "self" ? "self" : expenseData.expenseType,
          expenseAmount:
            type === "self" && selfExpenseType === "spent"
              ? -Number(expenseData.expenseAmount)
              : Number(expenseData.expenseAmount),
          expenseDescription: expenseData.expenseDescription,
          expenseCategory: expenseData.expenseCategory,
          expenseDate: expenseData.expenseDate || new Date(),
          friendId: selectedFriend?.user_id || "",
          currentUser: userId,
        }),
      });

      if (response.status !== 200)
        throw new Error("Error while adding expense");

      const data = await response.json();
      console.log(data, "DAT AFTER ADDING EXPENSE");
      if (type === "friends") {
        console.log(expenseData, "Expense Data IN FRIEND");
        handleExpenseChange(
          selectedFriend,
          expenseData.expenseType === "lended"
            ? Number(expenseData.expenseAmount)
            : -Number(expenseData.expenseAmount)
        );
      } else {
        //get yyyy-mm format
        const currentExpenseDate = new Date(expenseData.expenseDate);
        const monthAndYear = `${currentExpenseDate.getFullYear()}-${`${
          currentExpenseDate.getMonth() + 1
        }`.padStart(2, "0")}`;

        handleExpenseChange(monthAndYear, data.expense);
      }
      //reset state back to default values after adding expense since component won't unmount
      setExpenseData(defaultExpenseData);
      setSelectedFriend(null);
      setPopupOpen(false);
    } catch (error) {
      console.log(error, "error");
    }
  };

  const handleExpenseDataChange = (value, type) => {
    console.log(value, type, "Expense TYpe");
    setExpenseData((prevValue) => ({
      ...prevValue,
      [type]: value,
    }));
  };

  const handlePopupOpen = () => {
    setPopupOpen(true);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  const clearSelectedFriend = () => {
    setSelectedFriend(null);
  };
  return (
    <>
      <button className="add-expense-button" onClick={handlePopupOpen}>
        <img
          src="/plus-icon.svg"
          alt="add-spendings"
          className="add-expense-button-icon"
        />
      </button>

      {popupOpen && (
        <div className="add-expense-overlay">
          <div className="add-expenses-container">
            <button
              onClick={handleClosePopup}
              className="add-expense-close-button"
            >
              <img className="add-expense-close-icon" src="plus-icon.svg" />
            </button>
            {type === "friends" && (
              <>
                <div className="add-expense-search-friend-amount">
                  <div className="add-expense-search-friend">
                    <label
                      className="add-expenses-label"
                      htmlFor="search-friend"
                    >
                      Search for a friend
                    </label>
                    {selectedFriend ? (
                      <div className="add-expense-selected-friend-view">
                        <input
                          id="search-friend"
                          className="search-friend-input"
                          value={selectedFriend.email}
                          disabled={true}
                        />
                        <div
                          onClick={clearSelectedFriend}
                          className="add-expense-clear-friend"
                        >
                          x
                        </div>
                      </div>
                    ) : (
                      <SearchFriendList
                        setSelectedFriend={setSelectedFriend}
                        buttonContent={"Select"}
                      />
                    )}
                  </div>
                  <div className="add-expense-amount-block">
                    <label htmlFor="expense-amount">Amount</label>
                    <input
                      id="expense-amount"
                      type="number"
                      className="add-expense-amount-input"
                      value={expenseData.expenseAmount}
                      onChange={(event) =>
                        handleExpenseDataChange(
                          event.target.value,
                          "expenseAmount"
                        )
                      }
                    />
                  </div>
                </div>
              </>
            )}

            <div className="add-expenses-default-items">
              <div className="add-expenses-type-category">
                {type === "friends" ? (
                  <div className="add-expense-type-block">
                    <>
                      <label htmlFor="expense-type">Expense Type</label>
                      <div className="add-expense-input-container">
                        <input
                          id="expense-type"
                          className="add-expense-type-input"
                          value={expenseData.expenseType}
                          onClick={() => setDropdown("expenseType")}
                        />
                        {dropdown === "expenseType" && (
                          <Dropdown
                            dropdownValues={expenseTypeList}
                            selectedValue={expenseData.expenseType}
                            handleChange={handleExpenseDataChange}
                            type={"expenseType"}
                            setDropdown={setDropdown}
                          />
                        )}
                      </div>
                    </>
                  </div>
                ) : (
                  <>
                    <div className="add-expense-amount-block">
                      <label htmlFor="expense-amount">Amount</label>
                      <input
                        id="expense-amount"
                        type="number"
                        className="add-expense-amount-input"
                        value={expenseData.expenseAmount}
                        onChange={(event) =>
                          handleExpenseDataChange(
                            event.target.value,
                            "expenseAmount"
                          )
                        }
                      />
                    </div>
                    <div className="add-expense-category-block">
                      <label htmlFor="expense-category">Type</label>
                      <div className="add-expense-input-container">
                        <input
                          id="expense-category"
                          className="add-expense-category-input"
                          value={selfExpenseType}
                          onClick={() => setDropdown("selfExpenseType")}
                        />
                        {dropdown === "selfExpenseType" && (
                          <Dropdown
                            dropdownValues={selfExpenseTypes}
                            selectedValue={selfExpenseType}
                            handleChange={(value) => setSelfExpenseType(value)}
                            type={"selfExpenseType"}
                            setDropdown={setDropdown}
                          />
                        )}
                      </div>
                    </div>
                  </>
                )}
                <div className="add-expense-category-block">
                  <label htmlFor="expense-category">Expense Category</label>
                  <div className="add-expense-input-container">
                    <input
                      id="expense-amount"
                      className="add-expense-category-input"
                      value={expenseData.expenseCategory}
                      onChange={(event) =>
                        handleExpenseDataChange(
                          event.target.value,
                          "expenseCategory"
                        )
                      }
                      onClick={() => setDropdown("expenseCategory")}
                    />
                    {dropdown === "expenseCategory" && (
                      <Dropdown
                        dropdownValues={expenseCategoryList}
                        selectedValue={expenseData.expenseCategory}
                        handleChange={handleExpenseDataChange}
                        type={"expenseCategory"}
                        setDropdown={setDropdown}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="add-expense-description">
                <div className="add-expense-description-block">
                  <label htmlFor="expense-description">Description</label>
                  <textarea
                    id="expense-description"
                    className="add-expense-description-input"
                    type="text-area"
                    value={expenseData.expenseDescription}
                    onChange={(event) =>
                      handleExpenseDataChange(
                        event.target.value,
                        "expenseDescription"
                      )
                    }
                  />
                </div>
                <div className="add-expense-date-block">
                  <label htmlFor="expense-date">Expense Date</label>
                  <input
                    id="expense-date"
                    className="add-expense-date-input"
                    type="date"
                    max={currentDate}
                    value={expenseData.expenseDate}
                    onChange={(event) =>
                      handleExpenseDataChange(event.target.value, "expenseDate")
                    }
                  />
                </div>
              </div>
              <div className="add-expense-submit-block">
                <button
                  className="add-expense-submit-button"
                  onClick={handleSubmit}
                >
                  Add Expense
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
//lender
//borrower
//expense_date
//added_by
//created_at
//updated_at
