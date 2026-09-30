import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleSignInButton from '../components/GoogleSignInButton';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, loginWithGoogle, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const returnPath = location.state?.from?.pathname || '/dashboard';
      navigate(returnPath, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!identifier.trim()) {
      setError('Please enter your email address.');
      return;
    }
    
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);

    const result = await login(identifier, password);
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
              <i className="bi bi-file-earmark-text-fill text-primary-brand fs-1 mb-2 d-inline-block"></i>
              <h3 className="fw-bold text-dark">Welcome Back</h3>
              <p className="text-muted-brand mb-0">Sign in to continue with Form Saathi.</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 border-0 rounded-3 small mb-4">
                <i className="bi bi-exclamation-circle-fill me-2"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="form-label text-muted-brand small fw-bold">Email Address</label>
                <input 
                  type="email" 
                  className="form-control form-control-lg bg-light border-0" 
                  placeholder="Enter your registered email"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label text-muted-brand small fw-bold">Password</label>
                <div className="input-group">
                  <input 
                    type="password" 
                    className="form-control form-control-lg bg-light border-0" 
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="rememberMe" defaultChecked />
                  <label className="form-check-label small text-muted-brand" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-primary-brand w-100 py-3 fs-6 mb-4 d-flex justify-content-center align-items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Signing in...
                  </>
                ) : (
                  'Login'
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
              <p className="text-muted-brand small mb-2">Don't have an account?</p>
              <Link to="/register" className="btn-outline-brand px-4 py-2 w-100 d-inline-block text-decoration-none">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
