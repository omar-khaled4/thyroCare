import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import AboutUs from './components/AboutUs/AboutUs';
import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import Report from './components/Report/Report';
import Profile from './components/Profile/Profile';
import AiChat from './components/AiChat/AiChat';
import NotFound from './components/NotFound/NotFound';
import Dashboard from './components/Dashboard/Dashboard';
import UserContextProvider from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import ReportOptions from './components/ReportOptions/ReportOptions';
import InsertReport from './components/InsertReport/InsertReport';
import ViewReports from './components/ViewReports/ViewReports';


let x = createBrowserRouter([
  {
    path: "", element: <Layout />, children: [
      { index: true, element: <Home /> },
      { path: "about", element: <AboutUs /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
      { path: "dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      {
        path: "report", element: <ProtectedRoute><Report /></ProtectedRoute>, children:
          [
            { index: true, element: <ReportOptions /> },
            { path: "insert_report", element: <InsertReport /> },
            { path: "view_report", element: <ViewReports /> }
          ]
      },
      { path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "chat", element: <AiChat /> },
      { path: "*", element: <NotFound /> },
    ]
  }
])

function App() {

  return <>
    <UserContextProvider>
      <RouterProvider router={x}></RouterProvider>
    </UserContextProvider>
  </>
}

export default App
