import React from 'react'
import { Routes,Route } from 'react-router-dom'
import AuthForm from '../components/Auth/authForm'
import Loginform from '../components/Auth/loginform'
import UserHome from '../pages/userHome'
import UserProfileEdit from '../pages/userProfileEdit'
function AppRoute() {
  return (
    <div>
    <Routes>
        <Route path='/' element={<AuthForm/>} />
        <Route path='login' element={<Loginform/>} />
        <Route path='userhome' element={<UserHome/>} />
        <Route path='UserEdit' element={<UserProfileEdit/>} />
        {/* <Route path='/userhome' element={<UserDemo/>} /> */}
    </Routes>
    </div>
  )
}

export default AppRoute
