
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Key } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isOtpMode) {
        // API call for OTP verification
        const response = await fetch('https://api.learnlinker.example/auth/login/otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ phoneNumber, otp }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store token in localStorage for authenticated requests
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          toast.success("Login successful!");
          navigate('/dashboard'); 
        } else {
          toast.error(data.message || "OTP verification failed. Please try again.");
        }
      } else {
        // Regular email/password login
        // API call to backend for authentication
        const response = await fetch('https://api.learnlinker.example/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
          // Store token in localStorage for authenticated requests
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          toast.success("Login successful!");
          navigate('/dashboard'); // Redirect to dashboard or homepage after login
        } else {
          toast.error(data.message || "Login failed. Please check your credentials.");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Connection error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }
    
    setIsLoading(true);
    try {
      // API call to send OTP
      const response = await fetch('https://api.learnlinker.example/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("OTP sent to your phone!");
      } else {
        toast.error(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("OTP request error:", error);
      toast.error("Connection error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-primary">Welcome Back</h1>
            <p className="mt-2 text-sm text-foreground/70">Sign in to your LearnLinker account</p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              variant={!isOtpMode ? 'default' : 'outline'} 
              onClick={() => setIsOtpMode(false)}
            >
              Email Login
            </Button>
            <Button 
              variant={isOtpMode ? 'default' : 'outline'} 
              onClick={() => setIsOtpMode(true)}
            >
              OTP Login
            </Button>
          </div>
          
          {!isOtpMode ? (
            <form className="mt-8 space-y-6" onSubmit={handleLogin}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-foreground">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-primary hover:text-primary/80">
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-foreground">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    autoComplete="tel"
                    required
                    className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                  />
                </div>
                
                <div>
                  <Button 
                    onClick={handleRequestOtp} 
                    type="button" 
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </Button>
                </div>
                
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-foreground">
                    Enter OTP
                  </label>
                  <div className="mt-2">
                    <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                </div>
              </div>
              
              <div>
                <Button 
                  type="button" 
                  className="w-full"
                  disabled={isLoading || !otp || otp.length < 6}
                  onClick={handleLogin}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-primary hover:text-primary/80">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
