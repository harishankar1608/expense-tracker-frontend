import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Signup from "./controller/Signup";
import Login from "./controller/Login";
import ProtectedRoute from "./controller/authenticate/ProtectedRoute";
import OpenRoute from "./controller/authenticate/OpenRoute";
import Dashboard from "./controller/Dashboard";
import Request from "./controller/Request";
import ExpenseList from "./controller/ExpenseList";
import AddNewExpense from "./component/AddExpense/AddNewExpense";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";

const routes = createBrowserRouter([
  { path: "/", element: <ProtectedRoute component={<Dashboard />} /> },
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
      <AuthProvider>
        <ChatProvider>
          <RouterProvider router={routes} />
        </ChatProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
