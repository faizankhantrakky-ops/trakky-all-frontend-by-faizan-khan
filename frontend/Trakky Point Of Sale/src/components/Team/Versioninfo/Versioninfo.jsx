import React from 'react';
import {
  Package,
  Calendar,
  GitCommit,
  CheckCircle,
  ExternalLink,
  Shield,
  Mail,
  Info,
} from 'lucide-react';

const Versioninfo = () => {
  // --- Sample data (replace with real values) ---
  const version = 'v3.4.1';
  const buildDate = 'February 24, 2025';
  const buildTime = '03:44 PM UTC';
  const commitHash = 'b7f3e9b';
  const releaseType = 'Stable';
  const license = 'Proprietary License';
  const changelogUrl = 'https://salonposapp.trakky.in/';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mx-auto font-sans ">
      {/* Header – Brand & Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 ">Trakky - The  Software Platform</h2>
            <p className="text-sm text-gray-500">Salon Management Software</p>
          </div>
        </div>
        <div className="flex items-center text-xs text-gray-400">
          <Info className="w-4 h-4 mr-1" />
          <span>Version Details</span>
        </div>
      </div>

      {/* Version Badge */}
      <div className="mb-6">
        <span className="inline-block px-5 py-2 text-lg font-bold text-[#502DA6] bg-purple-50 rounded-xl border border-purple-200">
          {version}
        </span>
      </div>

      {/* Grid – Core Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Build Info */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2 text-[#502DA6]" />
              <span className="font-medium">Build Date</span>
            </div>
            <span className="text-sm text-gray-800">{buildDate}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center text-gray-600">
              <GitCommit className="w-5 h-5 mr-2 text-[#502DA6]" />
              <span className="font-medium">Commit</span>
            </div>
            <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
              {commitHash}
            </code>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center text-gray-600">
              <CheckCircle className="w-5 h-5 mr-2 text-[#502DA6]" />
              <span className="font-medium">Release Type</span>
            </div>
            <span className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full">
              {releaseType}
            </span>
          </div>
        </div>

        {/* Support & License */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center text-gray-600">
              <Shield className="w-5 h-5 mr-2 text-[#502DA6]" />
              <span className="font-medium">License</span>
            </div>
            <span className="text-sm text-gray-800">{license}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-gray-100">
            <div className="flex items-center text-gray-600">
              <Mail className="w-5 h-5 mr-2 text-[#502DA6]" />
              <span className="font-medium">Support</span>
            </div>
            <a
              href="mailto:support@trakky.com"
              className="text-sm text-[#502DA6] hover:underline"
            >
              support@trakky.com
            </a>
          </div>

         
        </div>
      </div>

      {/* Release Notes Summary */}
      <div className="bg-gray-50 rounded-lg p-5 mb-6">
        <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center">
          <Package className="w-4 h-4 mr-2 text-[#502DA6]" />
          Whats New in {version}
        </h4>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>Real-time sync engine upgraded to v3.2</li>
          <li>Enhanced audit logs with searchable timestamps</li>
          <li>UI performance improvements (lazy-load grids)</li>
          <li>Security patch for OAuth token rotation</li>
          <li>Bug fixes & stability enhancements</li>
        </ul>
      </div>

      {/* Footer */}
      <div className="pt-5 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} Trakky. All rights reserved. 
          <span className="text-[#502DA6] font-medium">Version {version}</span>
        </p>
      </div>
    </div>
  );
};

export default Versioninfo;