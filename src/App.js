import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Signup from './controller/Signup';
import Login from './controller/Login';
import ProtectedRoute from './controller/authenticator/ProtectedRoute';
import OpenRoute from './controller/authenticator/OpenRoute';
import Dashboard from './controller/Dashboard';
import FindFriends from './controller/FindFriends';
import Request from './controller/Request';
import AddExpense from './controller/AddExpense';
import ExpenseList from './controller/ExpenseList';

const routes = createBrowserRouter([
  { path: '/', element: <ProtectedRoute component={<Dashboard />} /> },
  {
    path: '/find-friends',
    element: <ProtectedRoute component={<FindFriends />} />,
  },
  {
    path: '/expenses',
    element: <ProtectedRoute component={<ExpenseList />} />,
  },
  {
    path: '/add-expenses',
    element: <ProtectedRoute component={<AddExpense />} />,
  },
  {
    path: '/requests',
    element: <ProtectedRoute component={<Request />} />,
  },

  {
    path: '/login',
    element: <OpenRoute component={<Login />} />,
  },
  {
    path: '/signup',
    element: <OpenRoute component={<Signup />} />,
  },
]);
function App() {
  return <RouterProvider router={routes} />;
}

export default App;
