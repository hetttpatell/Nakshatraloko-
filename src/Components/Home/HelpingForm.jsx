import React, { useState } from "react";
import Input from "../Input/Input";

function HelpingForm() {
  const [username , setUsername] = useState("");
  const [usernumber , setnumber] = useState();

  const handleSubmit = (e) => {}

  return (
    <>
      <div className="relative h-screen w-full">
        <h1 className="font-playfair font-bold text-5xl sm:text-4xl md:text-6xl lg:text-9xl
                       ml-6 sm:ml-20 lg:ml-80 lg:mt-7 mt-3 absolute whitespace-nowrap">
          Having Trouble
        </h1>

        <h1 className="font-playfair text-4xl sm:text-3xl md:text-7xl lg:text-8xl
                       ml-6 sm:ml-20 lg:ml-80 lg:mt-50 mt-19 absolute whitespace-nowrap">
          What To Buy ?
        </h1>

        <div className="bg-[var(--color-aboutbg)] ml-auto mt-70 lg:mt-100 h-35 lg:h-80 w-65 lg:w-290">
        </div>

        <h1 className="font-montserrat font-bold text-center mt-6 text-[10px] sm:text-3xl lg:text-2xl
                       text-gray-700 tracking-wide leading-relaxed max-w-4xl mx-auto px-4">
          Drop your number and our experts will reach out to you soon !
        </h1>

        <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md bg-transparent p-6 rounded-xl"
      >
        {/* First Name */}
        <div className="mb-6 jstifyceter">
          <label className="block mb-1 font-montserrat text-[#2c2c2c]">
            First Name
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter your first name"
            className="w-full border-b-2 border-[#5a4d41] bg-transparent focus:outline-none focus:border-[#4a3f35] py-2 text-[#2c2c2c] placeholder-gray-600"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-6">
          <label className="block mb-1 font-montserrat text-[#2c2c2c]">
            Phone Number
          </label>
          <input
            type="tel"
            value={usernumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full border-b-2 border-[#5a4d41] bg-transparent focus:outline-none focus:border-[#4a3f35] py-2 text-[#2c2c2c] placeholder-gray-600"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          className="w-full mt-4 bg-[#5a4d41] hover:bg-[#4a3f35] text-white font-semibold py-3 px-4 rounded transition"
        >
          Submit
        </button>
      </form>

      </div>
    </>
  )
}

export default HelpingForm;
