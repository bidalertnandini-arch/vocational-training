import { useAuth } from '@/contexts/AuthContext';
import DTODashboard from './DTODashboard';
import PrincipalDashboard from './PrincipalDashboard';
import FacultyDashboard from './FacultyDashboard';
import StudentDashboard from './StudentDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Render appropriate dashboard based on user role
  switch (user?.role) {
    case 'admin':
    case 'dto':
      return <DTODashboard />;
    case 'principal':
      return <PrincipalDashboard />;
    case 'faculty':
      return <FacultyDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <DTODashboard />;
  }
};

export default Dashboard;
