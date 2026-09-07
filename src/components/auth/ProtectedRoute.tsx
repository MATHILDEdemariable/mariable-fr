import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWedding } from '@/contexts/WeddingContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const { accountType, currentWeddingId, loading: weddingLoading } = useWedding();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ redirectAfterLogin: location.pathname }} replace />;
  }

  // Un compte professionnel sans mariage sélectionné passe d'abord par sa liste
  const isProSpace = location.pathname.startsWith('/pro');
  if (!weddingLoading && accountType === 'b2b' && !currentWeddingId && !isProSpace) {
    return <Navigate to="/pro" replace />;
  }

  return <>{children}</>;
};


export default ProtectedRoute;

