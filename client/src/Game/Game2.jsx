import React from 'react';
import images from '../assets/index.jsx';

const Game2 = () => {
  return (
    <div className="h-screen bg-blue-500 flex flex-col items-center justify-center text-center">
      
        <img src={images.Logo} alt="Logo" className="w-40 mb-2" />
      <div className="flex w-full h-full justify-center">


        <div className="bg-white rounded-lg shadow-lg p-4 w-1/4">
          <div className="flex flex-col space-y-4">
            {['User', 'User', 'User', 'User'].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
                <div className="flex items-center space-x-2">
                  <img src={images.UserAvatar} alt="User" className="w-8 h-8 rounded-full" />
                  <span>{user}</span>
                </div>
                {index === 0 && (
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Host</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between bg-white rounded-lg shadow-lg w-2/4 p-6 ml-6">
          <div className="text-yellow-500 text-3xl font-bold">Menunggu Pemain...</div>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg text-xl">
            Start
          </button>
        </div>

        <div className="flex flex-col justify-between bg-white rounded-lg shadow-lg w-2/4 p-6 ml-6">
          <div className="text-yellow-500 text-3xl font-bold">Menunggu Pemain...</div>
          <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg text-xl">
            Start
          </button>
        </div>



      </div>
      

    </div>
  );
};

export default Game2;
