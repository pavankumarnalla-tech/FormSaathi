import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, loginWithGoogle, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const returnPath = location.state?.from?.pathname || '/dashboard';
      navigate(returnPath, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Front-end Validations
    if (!fullName.trim()) {
      setError('Full Name is required.');
      return;
    }

    if (!email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    const result = await register(fullName, email, password, confirmPassword);
    setIsLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  const handleGoogleSuccess = async (credential) => {
    setError('');
    setIsLoading(true);
    const result = await loginWithGoogle(credential);
    setIsLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="container section-padding">
      <div className="row justify-content-center">
        <div className="col-11 col-md-8 col-lg-5">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
            <div className="text-center mb-4">
              <i className="bi bi-person-plus-fill text-primary-brand fs-1 mb-2 d-inline-block"></i>
              <h3 className="fw-bold text-dark">Create Account</h3>
              <p className="text-muted-brand mb-0">Join Form Saathi for simplified form filling.</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 border-0 rounded-3 small mb-4">
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="mb-3">
                <label className="form-label text-muted-brand small fw-bold">Full Name</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg bg-light border-0" 
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted-brand small fw-bold">Email Address</label>
                <input 
                  type="email" 
                  className="form-control form-control-lg bg-light border-0" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label text-muted-brand small fw-bold">Password</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg bg-light border-0" 
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted-brand small fw-bold">Confirm Password</label>
                <input 
                  type="password" 
                  className="form-control form-control-lg bg-light border-0" 
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary-brand w-100 py-3 fs-6 mb-4 d-flex justify-content-center align-items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Creating Account...
                  </>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            {/* OR Separator & Google Sign-In */}
            <div className="d-flex align-items-center my-4">
              <div className="flex-grow-1 border-bottom"></div>
              <span className="px-3 text-muted small fw-bold text-uppercase">OR</span>
              <div className="flex-grow-1 border-bottom"></div>
            </div>

            <GoogleSignInButton
              onSuccess={handleGoogleSuccess}
              onError={(err) => setError(err)}
              isLoading={isLoading}
            />

            <div className="text-center mt-3 border-top pt-4">
              <p className="text-muted-brand small mb-2">Already have an account?</p>
              <Link to="/login" className="btn-outline-brand px-4 py-2 w-100 d-inline-block text-decoration-none">
                Sign In Instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
