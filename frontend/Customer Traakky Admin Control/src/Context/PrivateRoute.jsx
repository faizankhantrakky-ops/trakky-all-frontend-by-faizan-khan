import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from './AuthContext';

const PrivateRoute = ({children, ...rest}) => {
    let { user } = useContext(AuthContext)

    return !user ? <Navigate to='/signin'/> : children;
}

export default PrivateRoute;

