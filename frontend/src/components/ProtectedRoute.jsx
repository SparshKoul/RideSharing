import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/** Rider pages require a real DB session; show a loader until bootstrap resolves. */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#08071E]">
        <div className="font-neo-mono text-xs font-bold text-[#D4FF00] uppercase tracking-widest animate-pulse">
          Restoring session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
}
