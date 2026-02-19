import { ShieldCheck, ShieldX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AgeVerificationProps {
  onVerify: () => void;
  onDeny: () => void;
}

const AgeVerification = ({ onVerify, onDeny }: AgeVerificationProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay/95 backdrop-blur-sm p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center gold-glow">
              <ShieldCheck className="w-10 h-10 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-center mb-3">
            Age Verification Required
          </h2>

          {/* Message */}
          <p className="text-muted-foreground text-center mb-8 leading-relaxed">
            You must be <span className="text-primary font-semibold">18 years or older</span> to access HotHub and view premium content.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={onVerify}
              className="w-full h-14 text-lg font-semibold gold-gradient text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              I am 18 or older
            </Button>

            <Button
              onClick={onDeny}
              variant="outline"
              className="w-full h-12 text-muted-foreground border-border hover:bg-surface-hover"
            >
              <ShieldX className="w-4 h-4 mr-2" />
              I am under 18
            </Button>
          </div>

          {/* Legal text */}
          <p className="text-xs text-muted-foreground text-center mt-6 leading-relaxed">
            By clicking "I am 18 or older", you confirm that you are of legal age to view adult content in your jurisdiction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AgeVerification;
