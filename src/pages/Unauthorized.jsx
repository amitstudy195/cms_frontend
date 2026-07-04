import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "../components/common/Button";

export const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 space-y-6">
      <div className="p-4 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-500 animate-bounce">
        <ShieldAlert className="h-12 w-12" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-white tracking-wide">403: Access Restricted</h1>
        <p className="text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          You do not have the required permissions to view this control panel. This directory is reserved for users with **Admin** access privileges.
        </p>
      </div>

      <div className="flex gap-4">
        <Link to="/">
          <Button variant="primary" size="sm" className="cursor-pointer">
            <ArrowLeft className="h-4.5 w-4.5" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
