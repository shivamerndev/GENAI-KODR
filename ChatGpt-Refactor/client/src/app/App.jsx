import { useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { Outlet } from 'react-router-dom';
import { Suspense } from "react";



const App = () => {

  const { getProfile } = useAuth();

  useEffect(() => {
    getProfile()
  }, [])


  return (<Outlet />)
}

export default App