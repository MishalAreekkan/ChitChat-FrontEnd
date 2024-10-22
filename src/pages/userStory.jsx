import React from 'react';
import { FaCamera } from "react-icons/fa";
import { useUserStory } from '../api/userside';

function UserStory() {
    const {data:story} = useUserStory()
    return (
        <div className="w-full bg-white">
            <div className="w-full overflow-x-auto  flex p-2 gap-2 scrollbar-hide">
                <div className="border-2 border-black border-dashed rounded-full w-16 h-16 flex-shrink-0 overflow-hidden">
                    <div className='p-0 absolute mt-5 ml-5'>
                        <FaCamera />
                    </div>
                </div>

                {[...Array(3)].map((_, index) => (
                    <div key={index} className="border-2 border-black rounded-full w-16 h-16 flex-shrink-0 overflow-hidden">
                        <img
                            src={`/erica-sinclair.jpg`}
                            alt={`Story ${index + 1}`}
                            className="object-cover w-full h-full"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserStory;

