import { Ban } from 'lucide-react';

const AccessDenied = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md animate-fade-in">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <Ban className="w-12 h-12 text-destructive" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>

        {/* Message */}
        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
          You must be 18 years or older to access HotHub. Please come back when you are of legal age.
        </p>

        {/* Footer */}
        <p className="text-sm text-muted-foreground">
          If you believe this is an error, please close this browser tab and try again.
        </p>
      </div>
    </div>
  );
};

export default AccessDenied;
