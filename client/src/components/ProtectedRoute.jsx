import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, ...rest }) => {
  const token = localStorage.getItem('accesstoken');
  
  return (
    <Route
      {...rest}
      element={token ? element : <Navigate to="/" replace />}
    />
  );
};

export default ProtectedRoute;
