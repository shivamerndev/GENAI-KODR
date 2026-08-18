import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import useAuth from '../hooks/useAuth';

const Login = () => {

  const { googleAuth } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLoginSuccess = (credentialResponse) => {
    setIsLoading(true)
    setError(null)
    try {
      googleAuth(credentialResponse)
    } catch (err) {
      setError('Authentication failed. Please try again.')
      setIsLoading(false)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] text-[var(--text-primary)] px-4 relative overflow-hidden transition-colors duration-200">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--accent-primary)] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-800 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative w-full max-w-sm z-10">
        {/* Card Container */}
        <div className="bg-[var(--bg-surface)] backdrop-blur-xl border border-[var(--border-medium)] rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:border-[var(--border-focus)]">

          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-hover)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--accent-glow)]">
                <svg className="w-7 h-7 text-[var(--text-inverse)]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-[var(--text-primary)] text-center mb-2">
              Welcome Back
            </h1>
            <p className="text-[var(--text-secondary)] text-center text-sm">
              Sign in to your account to continue
            </p>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg animate-in fade-in-50 duration-300">
                <p className="text-red-400 text-sm font-medium flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {/* Login Button */}
            <GoogleOAuthProvider clientId={"536825012398-c2gga80iemtn21prat7pdhqomsp6ichp.apps.googleusercontent.com"}>
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 bg-[var(--bg-surface)]/80 rounded-lg flex items-center justify-center z-10 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-5 h-5 border-2 border-[var(--accent-primary)] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-[var(--text-secondary)]">Authenticating...</span>
                    </div>
                  </div>
                )}

                <div className={`transition-all duration-300 flex justify-center ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
                  <GoogleLogin
                    onSuccess={handleLoginSuccess}
                    onError={() => setError('Login failed. Please try again.')}
                  />
                </div>
              </div>
            </GoogleOAuthProvider>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--border-medium)]"></div>
              <span className="text-[var(--text-muted)] text-xs">Google Sign-In</span>
              <div className="flex-1 h-px bg-gradient-to-r from-[var(--border-medium)] to-transparent"></div>
            </div>

            {/* Info Message */}
            <p className="text-[var(--text-muted)] text-xs text-center leading-relaxed">
              By signing in, you agree to our <a href="#" className="text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors">Terms of Service</a> and <a href="#" className="text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-[var(--text-muted)] text-sm">
          <p>Having trouble signing in? <a href="#" className="text-[var(--accent-primary)] hover:text-[var(--accent-hover)] transition-colors font-medium">Get help</a></p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  )
}
export default Login