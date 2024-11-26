import React from 'react'
import { Routes,Route } from 'react-router-dom'
import AuthForm from '../components/Auth/authForm'
import Loginform from '../components/Auth/loginform'
import UserHome from '../pages/userHome'
import UserProfileEdit from '../pages/userProfileEdit'
import UserVideo from '../pages/userVideo'
import UserChat from '../components/Chat/userChat'
import GroupChat from '../components/Chat/groupChat'
function AppRoute() {
  return (
    <div>
    <Routes>
        <Route path='/' element={<AuthForm/>} />
        <Route path='login' element={<Loginform/>} />
        <Route path='userhome' element={<UserHome/>} />
        <Route path='UserEdit' element={<UserProfileEdit/>} />
        <Route path='uservideo' element={<UserVideo/>} />
        <Route path='userchat' element={<UserChat />} />
        <Route path='groupchat' element={<GroupChat />} />

        {/* <Route path='/userhome' element={<UserDemo/>} /> */}
    </Routes>
    </div>
  )
}

export default AppRoute


// # # Logs
// # logs
// # *.log
// # npm-debug.log*
// # yarn-debug.log*
// # yarn-error.log*
// # pnpm-debug.log*
// # lerna-debug.log*

// # node_modules
// # dist
// # dist-ssr
// # *.local

// # # Editor directories and files
// # .vscode/*
// # !.vscode/extensions.json
// # .idea
// # .DS_Store
// # *.suo
// # *.ntvs*
// # *.njsproj
// # *.sln
// # *.sw?
