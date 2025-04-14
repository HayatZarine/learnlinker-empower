
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<'student' | 'volunteer'>('student');
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    subjects: '',
    grade: '',
    termsAccepted: false
  });
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Check if there's a role parameter in the URL
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get('role');
    
    if (role === 'volunteer') {
      setUserRole('volunteer');
    } else if (role === 'student') {
      setUserRole('student');
    }
  }, [location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.termsAccepted) {
      toast.error("Please accept the terms and conditions");
      return;
    }
    
    setIsLoading(true);

    try {
      if (isOtpMode) {
        // API call for OTP verification and registration
        const response = await fetch('https://api.learnlinker.example/auth/register/otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber,
            otp,
            firstName: formData.firstName,
            lastName: formData.lastName,
            role: userRole
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Registration successful!");
          navigate('/login');
        } else {
          toast.error(data.message || "OTP verification failed. Please try again.");
        }
      } else {
        // Regular email/password registration
        const response = await fetch('https://api.learnlinker.example/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            role: userRole
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast.success("Registration successful!");
          navigate('/login'); // Redirect to login page after successful registration
        } else {
          toast.error(data.message || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
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
            <h1 className="text-2xl font-bold text-primary">Create Your Account</h1>
            <p className="mt-2 text-sm text-foreground/70">
              Join as a {userRole === 'volunteer' ? 'volunteer teacher' : 'student'}
            </p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              variant={userRole === 'student' ? 'default' : 'outline'} 
              onClick={() => setUserRole('student')}
            >
              Student
            </Button>
            <Button 
              variant={userRole === 'volunteer' ? 'default' : 'outline'} 
              onClick={() => setUserRole('volunteer')}
            >
              Volunteer
            </Button>
          </div>

          <div className="flex justify-center space-x-4">
            <Button 
              variant={!isOtpMode ? 'default' : 'outline'} 
              onClick={() => setIsOtpMode(false)}
            >
              Email Signup
            </Button>
            <Button 
              variant={isOtpMode ? 'default' : 'outline'} 
              onClick={() => setIsOtpMode(true)}
            >
              OTP Signup
            </Button>
          </div>
          
          {!isOtpMode ? (
            <form className="mt-8 space-y-6" onSubmit={handleRegister}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
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
                    value={formData.email}
                    onChange={handleInputChange}
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
                    required
                    className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                
                {userRole === 'volunteer' && (
                  <div>
                    <label htmlFor="subjects" className="block text-sm font-medium text-foreground">
                      Subjects You Can Teach
                    </label>
                    <input
                      id="subjects"
                      name="subjects"
                      type="text"
                      placeholder="e.g., Mathematics, English, Science"
                      className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.subjects}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                
                {userRole === 'student' && (
                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-foreground">
                      Grade/Level
                    </label>
                    <select
                      id="grade"
                      name="grade"
                      className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.grade}
                      onChange={handleInputChange}
                    >
                      <option value="">Select your grade</option>
                      <option value="elementary">Elementary School (Grades 1-5)</option>
                      <option value="middle">Middle School (Grades 6-8)</option>
                      <option value="high">High School (Grades 9-12)</option>
                      <option value="college">College/University</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="termsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                  checked={formData.termsAccepted}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="termsAccepted" className="ml-2 block text-sm text-foreground">
                  I agree to the{' '}
                  <Link to="/terms" className="font-medium text-primary hover:text-primary/80">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-medium text-primary hover:text-primary/80">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="mt-8 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="otpFirstName" className="block text-sm font-medium text-foreground">
                      First Name
                    </label>
                    <input
                      id="otpFirstName"
                      name="firstName"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="otpLastName" className="block text-sm font-medium text-foreground">
                      Last Name
                    </label>
                    <input
                      id="otpLastName"
                      name="lastName"
                      type="text"
                      required
                      className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
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

                {userRole === 'volunteer' && (
                  <div>
                    <label htmlFor="subjects" className="block text-sm font-medium text-foreground">
                      Subjects You Can Teach
                    </label>
                    <input
                      id="subjects"
                      name="subjects"
                      type="text"
                      placeholder="e.g., Mathematics, English, Science"
                      className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.subjects}
                      onChange={handleInputChange}
                    />
                  </div>
                )}
                
                {userRole === 'student' && (
                  <div>
                    <label htmlFor="grade" className="block text-sm font-medium text-foreground">
                      Grade/Level
                    </label>
                    <select
                      id="grade"
                      name="grade"
                      className="mt-1 block w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.grade}
                      onChange={handleInputChange}
                    >
                      <option value="">Select your grade</option>
                      <option value="elementary">Elementary School (Grades 1-5)</option>
                      <option value="middle">Middle School (Grades 6-8)</option>
                      <option value="high">High School (Grades 9-12)</option>
                      <option value="college">College/University</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="otpTermsAccepted"
                  name="termsAccepted"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-primary focus:ring-primary border-input rounded"
                  checked={formData.termsAccepted}
                  onChange={handleCheckboxChange}
                />
                <label htmlFor="otpTermsAccepted" className="ml-2 block text-sm text-foreground">
                  I agree to the{' '}
                  <Link to="/terms" className="font-medium text-primary hover:text-primary/80">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-medium text-primary hover:text-primary/80">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              <div>
                <Button 
                  type="button" 
                  className="w-full"
                  disabled={isLoading || !otp || otp.length < 6}
                  onClick={handleRegister}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-primary hover:text-primary/80">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
