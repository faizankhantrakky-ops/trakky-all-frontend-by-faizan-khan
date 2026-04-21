import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import PersonIcon from "@mui/icons-material/Person";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in CreateMembership:", error, errorInfo);
    toast.error("An error occurred in this section. Please try again.");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="bg-white rounded-xl shadow-sm border border-red-200 p-8 max-w-md text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Something went wrong
            </h3>
            <p className="text-gray-600 mb-4">
              An error occurred in this section. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const CreateMembership = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    {
      id: "customer-membership",
      path: "create-customer-membership",
      label: "Customer Membership",
      icon: <PersonIcon className="h-5 w-5" />,
      description: "Manage individual customer memberships"
    },
    {
      id: "membership-type",
      path: "create-membership-type",
      label: "Membership Type",
      icon: <CardMembershipIcon className="h-5 w-5" />,
      description: "Define membership packages and types"
    }
  ];

  const isTabActive = (tabPath) => {
    return location.pathname.split("/").includes(tabPath);
  };

  return (
    <div className="h-full w-full bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center gap-3 mb-2">
             
              <div>
                <h1 className="text-xl md:text-xl font-semibold text-gray-800">
                  Membership Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Create and manage Membership Type's and customer subscriptions
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => {
                const isActive = isTabActive(tab.path);
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigate(`/catalogue/${tab.path}`)}
                    className={`
                      group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-300
                      ${isActive
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`
                        p-2 rounded-lg transition-colors duration-300
                      ${isActive
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200 group-hover:text-gray-600'
                        }
                      `}>
                        {tab.icon}
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{tab.label}</div>
                        <div className={`text-xs mt-0.5 ${isActive ? 'text-indigo-500' : 'text-gray-400'}`}>
                          {tab.description}
                        </div>
                      </div>
                      {isActive && (
                        <div className="ml-2 h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <ErrorBoundary>
              {React.cloneElement(props?.children)}
            </ErrorBoundary>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateMembership;