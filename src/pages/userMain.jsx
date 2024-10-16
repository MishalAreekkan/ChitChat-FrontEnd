import React from 'react'
import UserStory from './userStory'
import UserFeed from './userFeed'
import UserMind from './userMind'
function UserMain() {
  return (
    <div className='w-full h-full bg-white'>
      <UserStory/>
      <UserMind/>
      <UserFeed/>
    </div>
  )
}

export default UserMain
