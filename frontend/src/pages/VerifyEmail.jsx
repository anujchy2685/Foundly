import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  verifyEmail as verifyEmailRequest,
  resendOtp as resendOtpRequest,
} from "../services/authServices";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const location = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState(location.state?.notice || "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the six-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await verifyEmailRequest({ email, otp });
      setMessage(data.message);
      navigate("/login", { state: { notice: data.message } });
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to verify your email."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    setIsResending(true);
    try {
      const data = await resendOtpRequest(email);
      setMessage(data.message);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Unable to resend the verification code."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
        <h1 className="mb-3 text-center text-3xl font-bold text-gray-800">
          Verify your email
        </h1>
        <p className="mb-6 text-center text-gray-600">
          Enter the six-digit code sent to {email || "your email address"}.
        </p>

        {message && (
          <p role="status" className="mb-4 rounded-md bg-blue-50 p-3 text-blue-800">
            {message}
          </p>
        )}
        {error && (
          <p role="alert" className="mb-4 rounded-md bg-red-50 p-3 text-red-700">
            {error}
          </p>
        )}

        {email ? (
          <>
            <form onSubmit={handleVerify} className="space-y-5">
              <label className="flex flex-col font-semibold text-gray-700">
                Verification code
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otp}
                  onChange={(event) =>
                    setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="mt-2 rounded-md border border-gray-300 px-3 py-2 font-normal outline-none focus:border-blue-500"
                />
              </label>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600 disabled:opacity-60"
              >
                {isSubmitting ? "Verifying..." : "Verify email"}
              </button>
            </form>
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="mt-4 w-full text-center font-semibold text-blue-600 hover:underline disabled:opacity-60"
            >
              {isResending ? "Sending..." : "Resend verification code"}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="w-full rounded-md bg-blue-500 py-2 font-semibold text-white hover:bg-blue-600"
          >
            Back to signup
          </button>
        )}
      </div>
    </div>
  );
}

export default VerifyEmail;
