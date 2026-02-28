"use client";

import { FC, useEffect } from "react";

type ErrorProps = { error: Error; reset: () => void };
const Error: FC<ErrorProps> = ({ error }) => {
  // Log the error to an error reporting service
  useEffect(() => console.error("Application error:", error), [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-center">
      {process.env.NODE_ENV === "development" && (
        <div className="mt-4 max-h-[30vh] overflow-y-auto rounded-lg border border-gray-800/30 bg-gray-900/50 p-3 text-left backdrop-blur-sm sm:mt-6 sm:p-4">
          <p className="text-sm font-medium text-gray-400">Error details:</p>
          <pre className="mt-2 text-sm text-gray-400">{error.message}</pre>
        </div>
      )}
    </div>
  );
};

export default Error;
