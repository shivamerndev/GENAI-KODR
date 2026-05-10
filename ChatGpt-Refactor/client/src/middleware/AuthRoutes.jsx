import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AuthRoutes = ({ children }) => {

    const { loading, user } = useSelector((state) => state.auth);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AuthRoutes;