import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function VerifyOTP() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setErr("");
    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      alert(res.data.message);

      alert("Email verified successfully. Please login."); 
      navigate("/login");
    } catch (error) {
      setErr(
        error.response?.data?.message ||
          "OTP verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card p-7 w-full max-w-md">
        <h1 className="text-2xl font-semibold">
          Verify Email
        </h1>

        <p className="text-sm text-muted mt-2">
          Enter your email and OTP.
        </p>

        <form
          onSubmit={submit}
          className="mt-6 space-y-4"
        >
          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
          />

          <input
            className="input"
            placeholder="OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            required
          />

          {err && (
            <div className="text-red-500">
              {err}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}