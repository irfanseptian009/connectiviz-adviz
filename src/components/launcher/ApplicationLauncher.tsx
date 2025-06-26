"use client";

import React from "react";
import { useSSO } from "@/context/SSOContext";
import { Application } from "@/services/sso.service";
import { Target, BarChart3, ExternalLink } from "lucide-react";

interface ApplicationCardProps {
  application: Application;
  onLaunch: (app: Application) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ application, onLaunch }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Target':
        return <Target className="w-8 h-8" />;
      case 'BarChart3':
        return <BarChart3 className="w-8 h-8" />;
      default:
        return <ExternalLink className="w-8 h-8" />;
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'green':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'orange':
        return 'bg-orange-500 hover:bg-orange-600 text-white';
      case 'purple':
        return 'bg-purple-500 hover:bg-purple-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  return (
    <div
      className={`
        relative p-6 rounded-xl cursor-pointer transition-all duration-300 
        transform hover:-translate-y-2 hover:shadow-xl
        ${getColorClasses(application.color)}
      `}
      onClick={() => onLaunch(application)}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-full">
          {getIcon(application.icon)}
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">{application.name}</h3>
          <p className="text-sm opacity-90 leading-relaxed">
            {application.description}
          </p>
        </div>

        {application.requiresAuth === false && (
          <span className="absolute top-2 right-2 bg-white/20 px-2 py-1 rounded-full text-xs">
            No Auth
          </span>
        )}
      </div>
    </div>
  );
};

interface ApplicationLauncherProps {
  className?: string;
}

export const ApplicationLauncher: React.FC<ApplicationLauncherProps> = ({ className = "" }) => {
  const { applications, openApplication, refreshApplications, isAuthenticated } = useSSO();

  React.useEffect(() => {
    if (isAuthenticated && applications.length === 0) {
      refreshApplications();
    }
  }, [isAuthenticated, applications.length, refreshApplications]);

  if (!isAuthenticated) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <p className="text-gray-600 dark:text-gray-400">
          Please log in to access applications.
        </p>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <p className="text-gray-600 dark:text-gray-400">
          Loading applications...
        </p>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          Application Launcher
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose an application to launch with SSO authentication
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {applications.map((app) => (
          <ApplicationCard
            key={app.id}
            application={app}
            onLaunch={openApplication}
          />
        ))}
      </div>
    </div>
  );
};
