export const validateExpense = (expenseAmount, type, selectedFriend) => {
  if (!expenseAmount || isNaN(Number(expenseAmount)))
    return "Please enter a valid amount to add expense";

  if (type !== "self" && !selectedFriend)
    return "Please select a friend to add expense";

  return null;
};
