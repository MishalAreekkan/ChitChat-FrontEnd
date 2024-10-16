import React from 'react'
import UserNavbar from './userNavbar'
import { FaCamera } from "react-icons/fa";
import { useSelector } from 'react-redux';

function UserProfileEdit() {
    const user = useSelector(state => state.auth.user)
    const baseUrl = "http://127.0.0.1:8000/"
    return (<>
        <div>
            <UserNavbar />
            <div className="flex flex-col items-center w-full p-6 bg-gray-100">
                <div className='flex justify-center gap-x-60'>
                    <div className="relative">
                        <div className="w-40 h-40 bg-gray-300 rounded-full flex items-center justify-center">
                            <img
                                className="w-40 h-40 rounded-full flex items-center justify-center"
                                src={user?.picture?.startsWith('http') ? user.picture : `${baseUrl}${user.picture}`}
                                alt="Profile"
                            />
                        </div>
                        <div className="absolute top-5 right-0 bg-white rounded-full w-6 h-6 flex items-center justify-center">
                            <button>
                                <FaCamera />
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <h1 className="font-bold text-lg">{user.username}</h1>
                        <div className="mt-2 space-x-2">
                            <button className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded">Edit profile</button>
                            <button className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded">View archive</button>
                        </div>
                        <div className='flex justify-between mt-2'>
                            <div>
                                <h2 className="font-bold">0</h2>
                                <p className="text-gray-500 text-sm">Posts</p>
                            </div>
                            <div>
                                <h2 className="font-bold">0</h2>
                                <p className="text-gray-500 text-sm">Followers</p>
                            </div>
                            <div>
                                <h2 className="font-bold">0</h2>
                                <p className="text-gray-500 text-sm">Following</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-4 mt-4 text-center">
                        <div className=''>
                            <button>
                                <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                                    <FaCamera />
                                </div>
                                New!
                            </button>
                        </div>
                    </div>
                </div>
                    {/* <div>
                        <div>
                        Professional Dashboard
                        </div>
                        <button>
                            32 accounts reached in the 30 days
                        </button>
                    </div> */}
                <div className="flex flex-col items-center mt-6 space-y-4">

                    <h2 className="font-bold text-lg">Share Photos</h2>
                    <p className="text-gray-500 text-center text-sm">
                        When you share photos, they will appear on your profile.
                    </p>
                </div>

                {/* Tabs */}
                <div className="mt-8 w-full flex justify-around border-t border-gray-300 pt-4">
                    <button className="text-gray-500">POSTS</button>
                    <button className="text-gray-500">SAVED</button>
                    <button className="text-gray-500">TAGGED</button>
                </div>
            </div>
        </div>
    </>)
}

export default UserProfileEdit
