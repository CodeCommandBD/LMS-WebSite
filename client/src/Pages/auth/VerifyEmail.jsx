import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import api from "@/lib/api";
import { CheckCircle2, XCircle, Loader2, Mail, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // "loading" | "success" | "error" | "resend"
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState("idle"); // "idle" | "loading" | "sent"

  useEffect(() => {
    if (!token) {
      setStatus("resend");
      setMessage(
        "No verification token found. You can request a new link below.",
      );
      return;
    }

    const verify = async () => {
      try {
        const { data } = await api.get(`/users/verify-email?token=${token}`);
        if (data.success) {
          setStatus("success");
          setMessage(data.message);
          // Redirect to login after 3s
          setTimeout(() => navigate("/login"), 3000);
        } else {
          setStatus("error");
          setMessage(data.message || "Verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ||
            "Verification link is invalid or has expired.",
        );
      }
    };

    verify();
  }, [token, navigate]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;
    setResendStatus("loading");
    try {
      const { data } = await api.post("/users/resend-verification", {
        email: resendEmail,
      });
      setResendStatus("sent");
      setMessage(data.message);
    } catch (err) {
      setResendStatus("idle");
      setMessage(
        err?.response?.data?.message || "Failed to resend. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 shadow-2xl text-center space-y-6">
          {/* Loading */}
          {status === "loading" && (
            <>
              <div className="inline-flex p-5 bg-blue-500/10 rounded-full">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
              </div>
              <h1 className="text-2xl font-black text-white">
                Verifying your email...
              </h1>
              <p className="text-gray-400">Please wait a moment.</p>
            </>
          )}

          {/* Success */}
          {status === "success" && (
            <>
              <div className="inline-flex p-5 bg-green-500/10 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-green-400" />
              </div>
              <h1 className="text-2xl font-black text-white">
                Email Verified! 🎉
              </h1>
              <p className="text-gray-300">{message}</p>
              <p className="text-gray-500 text-sm">
                Redirecting to login in 3 seconds...
              </p>
              <Button
                onClick={() => navigate("/login")}
                className="w-full rounded-2xl py-6 bg-green-600 hover:bg-green-700 font-bold text-white"
              >
                Go to Login Now
              </Button>
            </>
          )}

          {/* Error — show resend form */}
          {(status === "error" || status === "resend") && (
            <>
              {status === "error" ? (
                <div className="inline-flex p-5 bg-red-500/10 rounded-full">
                  <XCircle className="w-12 h-12 text-red-400" />
                </div>
              ) : (
                <div className="inline-flex p-5 bg-purple-500/10 rounded-full">
                  <Mail className="w-12 h-12 text-purple-400" />
                </div>
              )}

              <h1 className="text-2xl font-black text-white">
                {status === "error"
                  ? "Verification Failed"
                  : "Verify Your Email"}
              </h1>
              <p className="text-gray-400 text-sm">{message}</p>

              {resendStatus === "sent" ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4">
                  <p className="text-green-400 font-bold text-sm">
                    ✅ New verification link sent! Check your inbox.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleResend} className="space-y-4 text-left">
                  <div>
                    <label className="text-gray-300 text-sm font-bold block mb-2">
                      Enter your email to get a new link:
                    </label>
                    <input
                      type="email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={resendStatus === "loading"}
                    className="w-full rounded-xl py-5 bg-purple-600 hover:bg-purple-700 font-bold text-white flex items-center justify-center gap-2"
                  >
                    {resendStatus === "loading" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <RefreshCcw className="w-4 h-4" />
                        Resend Verification Email
                      </>
                    )}
                  </Button>
                </form>
              )}

              <Link
                to="/login"
                className="text-sm text-gray-500 hover:text-purple-400 transition-colors block"
              >
                ← Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
