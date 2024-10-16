import React from 'react';
import UserProfile from './userProfile';
import UserFriends from './userFriends';
import UserNavbar from './userNavbar';
import UserMain from './userMain';

function UserHome() {
    return (
        <div className="w-screen h-screen">
            <UserNavbar />
            <div className="flex flex-col md:flex-row w-screen h-screen mt-4">
                <div className=" w-full md:w-1/4 h-1/3 md:h-screen">
                    <UserProfile />
                </div>
                <div className="bg-yellow-400 w-full md:w-1/2 h-1/3 md:h-screen">
                    <UserMain />
                </div>
                <div className=" w-full md:w-1/3 h-1/3 md:h-screen">
                    <UserFriends />
                </div>
            </div>
        </div>
    );
}

export default UserHome;
