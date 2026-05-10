import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import useAuth from '../hooks/useAuth';

const Login = () => {

  const {googleAuth} = useAuth()

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900">
      <div className="w-full max-w-sm p-8 bg-zinc-800 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-white text-center mb-6">Login Your Account</h2>

        <GoogleOAuthProvider clientId={"536825012398-c2gga80iemtn21prat7pdhqomsp6ichp.apps.googleusercontent.com"}>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              googleAuth(credentialResponse);
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
        </GoogleOAuthProvider>

      </div>
    </div>
  )
}
export default Login