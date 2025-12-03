import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Signup from "./controller/Signup";
import Login from "./controller/Login";
import ProtectedRoute from "./controller/authenticator/ProtectedRoute";
import OpenRoute from "./controller/authenticator/OpenRoute";
import Dashboard from "./controller/Dashboard";
import FindFriends from "./controller/FindFriends";
import Request from "./controller/Request";
import ExpenseList from "./controller/ExpenseList";
import AddNewExpense from "./component/AddExpense/AddNewExpense";

const routes = createBrowserRouter([
  { path: "/", element: <ProtectedRoute component={<Dashboard />} /> },
  {
    path: "/find-friends",
    element: <ProtectedRoute component={<FindFriends />} />,
  },
  {
    path: "/expenses",
    element: <ProtectedRoute component={<ExpenseList />} />,
  },
  {
    path: "/add-friend-expenses",
    element: <ProtectedRoute component={<AddNewExpense type="friends" />} />,
  },
  {
    path: "/add-self-expenses",
    element: <ProtectedRoute component={<AddNewExpense type="self" />} />,
  },
  {
    path: "/requests",
    element: <ProtectedRoute component={<Request />} />,
  },
  {
    path: "/login",
    element: <OpenRoute component={<Login />} />,
  },
  {
    path: "/signup",
    element: <OpenRoute component={<Signup />} />,
  },
]);
function App() {
  return (
    <div className="container">
      <RouterProvider router={routes} />
    </div>
  );
}

export default App;

// after adding expense close popup automatically and the expense in expense list - friend expense - done
// after adding expense close popup automatically and the expense in expense list - spendings - done
// When a different month is selected update the total spending - spendings - done
// only display spendings of the selected month - done
// make the drop down disappear when clicked else where in both friend expense and spendings
//
