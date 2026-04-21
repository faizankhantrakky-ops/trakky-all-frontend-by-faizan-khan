import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from './context/Auth'

const PrivateRoute = () => {

    const { user , isAuthenticated } = useContext(AuthContext);

  return isAuthenticated || user ? (
    <Outlet />
  ) : (
    <Navigate to="/" />
  )
}

export default PrivateRoute