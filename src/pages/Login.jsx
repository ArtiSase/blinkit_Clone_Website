import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Smartphone, ArrowRight, Zap, Shield } from 'lucide-react';

const DEMO_OTP = '1234';

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState('mobile'); // 'mobile' | 'otp'
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [mobileError, setMobileError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMobileSubmit = (e) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setMobileError('Please enter a valid 10-digit mobile number');
      return;
    }
    setMobileError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 1000);
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    // Auto-focus next
    if (val && i < 3) {
      document.getElementById(`otp-${i + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) {
      document.getElementById(`otp-${i - 1}`)?.focus();
    }
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const entered = otp.join('');
    if (entered !== DEMO_OTP) {
      setOtpError(`Incorrect OTP. Demo OTP is: ${DEMO_OTP}`);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Left panel */}
        <div className="login-left">
          <div className="login-logo">
            <Zap size={32} fill="white" color="white" />
            <span>blinkit clone</span>
          </div>
          <h2>India's fastest grocery delivery</h2>
          <p>Get groceries delivered to your doorstep in 10 minutes</p>
          <div className="login-features">
            <div className="login-feature"><Shield size={18} /> Secure & trusted</div>
            <div className="login-feature"><Zap size={18} /> 10-min delivery</div>
            <div className="login-feature"><Smartphone size={18} /> Easy OTP login</div>
          </div>
        </div>

        {/* Right panel */}
        <div className="login-right">
          {step === 'mobile' ? (
            <form onSubmit={handleMobileSubmit} className="login-form">
              <h3>Login / Signup</h3>
              <p className="login-subtitle">Enter your mobile number to continue</p>

              <div className="form-group">
                <label>Mobile Number</label>
                <div className="mobile-input-wrap">
                  <span className="country-code">+91</span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={mobile}
                    onChange={(e) => {
                      setMobile(e.target.value.replace(/\D/g, '').slice(0, 10));
                      setMobileError('');
                    }}
                    maxLength={10}
                    autoFocus
                  />
                </div>
                {mobileError && <span className="form-error">{mobileError}</span>}
              </div>

              <button type="submit" className="btn-login-submit" disabled={loading}>
                {loading ? 'Sending OTP...' : <>Continue <ArrowRight size={18} /></>}
              </button>

              <p className="login-disclaimer">
                By continuing, you agree to our Terms of Service and Privacy Policy.
                This is a demo login — no actual OTP will be sent.
              </p>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="login-form">
              <h3>Verify OTP</h3>
              <p className="login-subtitle">
                Enter the 4-digit OTP sent to +91 {mobile}
                <button type="button" className="change-mobile" onClick={() => { setStep('mobile'); setOtp(['', '', '', '']); }}>
                  Change
                </button>
              </p>

              <div className="otp-inputs">
                {otp.map((val, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="otp-box"
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              {otpError && <span className="form-error">{otpError}</span>}

              <div className="demo-otp-hint">
                💡 Demo OTP: <strong>{DEMO_OTP}</strong>
              </div>

              <button type="submit" className="btn-login-submit" disabled={loading}>
                {loading ? 'Verifying...' : <>Verify & Login <ArrowRight size={18} /></>}
              </button>

              <button type="button" className="resend-otp">Resend OTP (demo)</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
