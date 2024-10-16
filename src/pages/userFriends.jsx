import React from 'react'
import { IoMdPersonAdd } from "react-icons/io";
function UserFriends() {
    const friends = [
        { name: "John Bruce", profession: "No Profession", img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIIQb6U4OUfRB0ddrwRCeMM3bdrwpohfm_TyG9n-lBiBzwlnOuncyLUtohth1_oSJMdAw&usqp=CAU" },
        { name: "Anna Mariya", profession: "Web Developer", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUiQprIzqdBNqRY4vkz1ophC-T7Zbp-mea1QifrJYaHWgkvXWv1vjLbym_o45O_faBk5g&usqp=CAU" },
        { name: "Mille Brown", profession: "MERN Stack Developer", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-3G2k6ECBmcv0BnUYIR_S55uBOuRen2sL7h7aGyb2LrHyei0IKdtY_AKhxPyod72cVpQ&usqp=CAU" }
    ];

    return (
        <div className='w-full h-full p-5 overflow-auto'>
            <div className="w-full shadow-md rounded-lg border-2">
                <marquee >Friend Request ***</marquee>

                <div className="p-5 border-t">

                    {friends?.map((friend, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={friend?.img} alt={friend?.name} className="w-12 h-12 rounded-full object-cover" />
                                <div className="ml-4">
                                    <p className="text-sm">{friend?.name}</p>
                                    <p className="text-gray-500 text-sm ">{friend?.profession}</p>
                                </div>
                            </div>

                            <div className="flex space-x-2 ">
                                <button className="border border-gray-300 bg-black text-white p-1 text-sm rounded-full">Accept</button>
                                <button className="border border-gray-300 p-1 text-sm rounded-full">Deny</button>
                            </div>
                        </div>
                    ))}

                </div>
            </div>

            {/* Friend Suggestion  */}

            <div className="w-full shadow-md rounded-lg border-2 mt-6">
                <marquee >Friend Suggestion</marquee>

                <div className="p-5 border-t">

                    {friends?.map((friend, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={friend?.img} alt={friend?.name} className="w-12 h-12 rounded-full object-cover" />
                                <div className="ml-4">
                                    <p className="text-sm">{friend?.name}</p>
                                    <p className="text-gray-500 text-sm ">{friend?.profession}</p>
                                </div>
                            </div>

                            <div className="flex space-x-2 ">
                            <IoMdPersonAdd />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserFriends
