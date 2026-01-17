import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Mail, CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // 'success', 'error', or null
  const [pendingEmail, _setPendingEmail] = useState(
    localStorage.getItem("pendingEmail") || ""
  );
  const [isResending, setIsResending] = useState(false);
  const { authUser, checkAuth } = useAuthStore();

  // If user is already logged in, redirect to home
  useEffect(() => {
    if (authUser) {
      navigate("/");
    }
  }, [authUser, navigate]);

  // Verify email if token is in URL
  useEffect(() => {
    const verifyToken = async (token) => {
      setIsVerifying(true);
      try {
        await axiosInstance.get(`/auth/verify-email?token=${token}`);
        setVerificationStatus("success");
        localStorage.removeItem("pendingEmail");

        // Auto redirect to home after 3 seconds
        setTimeout(() => {
          checkAuth();
          navigate("/");
        }, 3000);
      } catch {
        setVerificationStatus("error");
      } finally {
        setIsVerifying(false);
      }
    };

    const token = searchParams.get("token");
    if (token && !isVerifying) {
      verifyToken(token);
    }
  }, [isVerifying, searchParams, checkAuth, navigate]);

  const handleResendEmail = async () => {
    if (!pendingEmail) {
      return;
    }

    setIsResending(true);
    try {
      await axiosInstance.post("/auth/resend-verification", {
        email: pendingEmail,
      });
    } catch (error) {
      console.error("Failed to resend email:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-base-100 rounded-lg shadow-lg p-8 space-y-6">
          {/* Icon and Title */}
          <div className="text-center space-y-4">
            {isVerifying ? (
              <div className="flex justify-center">
                <Loader2 className="size-12 text-primary animate-spin" />
              </div>
            ) : verificationStatus === "success" ? (
              <CheckCircle className="size-12 text-success mx-auto" />
            ) : verificationStatus === "error" ? (
              <XCircle className="size-12 text-error mx-auto" />
            ) : (
              <Mail className="size-12 text-primary mx-auto" />
            )}

            {isVerifying && (
              <>
                <h1 className="text-2xl font-bold">Verifying Email...</h1>
                <p className="text-base-content/60">
                  Please wait while we verify your email address
                </p>
              </>
            )}

            {verificationStatus === "success" && (
              <>
                <h1 className="text-2xl font-bold text-success">
                  Email Verified!
                </h1>
                <p className="text-base-content/60">
                  Your email has been successfully verified. You can now use all
                  features of Convoo.
                </p>
              </>
            )}

            {verificationStatus === "error" && (
              <>
                <h1 className="text-2xl font-bold text-error">
                  Verification Failed
                </h1>
                <p className="text-base-content/60">
                  The verification link may have expired or is invalid. Please
                  try again.
                </p>
              </>
            )}

            {!verificationStatus && !isVerifying && (
              <>
                <h1 className="text-2xl font-bold">Verify Your Email</h1>
                <p className="text-base-content/60">
                  We've sent a verification email to{" "}
                  <span className="font-semibold">{pendingEmail}</span>
                </p>
              </>
            )}
          </div>

          {/* Message Content */}
          {!verificationStatus && !isVerifying && (
            <div className="space-y-4">
              <div className="bg-base-200 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold">What's next?</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm text-base-content/70">
                  <li>Check your email inbox</li>
                  <li>Click the verification link</li>
                  <li>You'll be automatically logged in</li>
                </ol>
              </div>

              <div className="bg-warning/10 border border-warning rounded-lg p-4">
                <p className="text-sm text-warning font-medium">
                  💡 Don't see the email? Check your spam folder or request a
                  new one below.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!verificationStatus && !isVerifying && (
              <>
                <button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="btn btn-outline w-full"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <Mail className="size-4" />
                      Resend Verification Email
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="btn btn-ghost w-full"
                >
                  Go Back to Sign Up
                </button>
              </>
            )}

            {verificationStatus === "success" && (
              <button
                onClick={() => navigate("/")}
                className="btn btn-primary w-full"
              >
                <ArrowRight className="size-4" />
                Go to Home
              </button>
            )}

            {verificationStatus === "error" && (
              <>
                <button
                  onClick={handleResendEmail}
                  disabled={isResending}
                  className="btn btn-primary w-full"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <Mail className="size-4" />
                      Resend Verification Email
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="btn btn-ghost w-full"
                >
                  Sign Up Again
                </button>
              </>
            )}
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs text-base-content/50">
            Verification link expires in 24 hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
