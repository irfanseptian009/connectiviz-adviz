import Image from "next/image";
import cardcover from "../../../public/images/grid-image/cardcover.png"


export default function CardGate() {
  return (
    <div className="w-64 overflow-hidden rounded-xl  shadow-2xl">
        <Image src={cardcover} alt="card" className="h-36 rounded-2xl absolute border-4 dark:border-gray-600 shadow-lg" />
      <div className="relative flex h-36">
        {/* Left side - Image background */}
        <div className="w-44 h-96 overflow-hidden">
      
        </div>

        {/* Right side - Blue section with text */}
       
        <div className="flex flex-row justify-center w-full  rounded-3xl shadow-xl bg-blue-500 dark:bg-gray-900/80 text-white">
        <div className="bg-gradient-to-bl from-orange-300 to-orange-800  border-1 border-orange-400 shadow-2xl mt-6 h-24 w-8 rounded-r-full "></div>
        <div className="flex flex-col m-2">
        <h2 className="text-2xl font-bold mt-8">Naruku</h2>
          <p className="text-sm text-gray-200 opacity-80">
            ini adalh description app
          </p>
        </div>
        
          
        </div>
        

        {/* Center circle with logo */}
        <div className="absolute left-24 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900 rounded-full h-16 w-16 flex items-center justify-center border-2 shadow-2xl border-gray-400">
          <div className="text-center">
            <svg className="w-9 h-9 mx-auto text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
            </svg>
    
          </div>
          
        </div>
      </div>
    </div>
  );
}