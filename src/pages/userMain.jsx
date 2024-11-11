import React from 'react'
import UserStory from './userStory'
import UserFeed from './userFeed'
import UserMind from './userMind'
function UserMain() {
  return (
    <div className='w-full h-screen bg-white overflow-auto'>
      <UserStory/>
      <UserMind/>
      <UserFeed/>
    </div>
  )
}

export default UserMain
