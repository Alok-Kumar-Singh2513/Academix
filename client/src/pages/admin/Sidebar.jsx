import { ChartNoAxesColumn, SquareLibrary, Users } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className="flex space-y-20">
      {/* Sidebar */}
      <div className="w-[250px] border-r border-gray-300 dark:border-gray-700 p-6 sticky top-0 h-screen bg-white dark:bg-gray-900">
        <div className="space-y-4">
          {/* <Link 
            to="dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('dashboard') 
                ? 'bg-gray-100 dark:bg-gray-800 text-primary' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <ChartNoAxesColumn size={22} />
            <span className="font-medium">Dashboard</span>
          </Link> */}
          <Link 
            to="course" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('course') 
                ? 'bg-gray-100 dark:bg-gray-800 text-primary' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <SquareLibrary size={22} />
            <span className="font-medium">Courses</span>
          </Link>
          <Link 
            to="course" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('course') 
                ? 'bg-gray-100 dark:bg-gray-800 text-primary' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <SquareLibrary size={22} />
            <span className="font-medium">Courses</span>
          </Link>

          <Link 
            to="dashboard" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('dashboard') 
                ? 'bg-gray-100 dark:bg-gray-800 text-primary' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <ChartNoAxesColumn size={22} />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link 
            to="enrolled-students" 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('enrolled-students') 
                ? 'bg-gray-100 dark:bg-gray-800 text-primary' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <Users size={22} />
            <span className="font-medium">Enrolled Students</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidebar;
