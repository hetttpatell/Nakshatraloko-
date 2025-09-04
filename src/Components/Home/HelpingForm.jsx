import React, { useState } from "react";
import Input from "../Input/Input";
import { useTime } from "framer-motion";
import Button from "../Button/Button";

function HelpingForm() {
  const [username, setUsername] = useState("");
  const [usernumber, setnumber] = useState();
  const [usetime, setusertime] = useState("09:00");
  const [usedate, setdate] = useState("");

  const handleSubmit = (e) => { }

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

        <div
  className="bg-[var(--color-aboutbg)] 
             ml-auto 
             mt-20 lg:mt-50 
             h-35 md:h-60 lg:h-80 
             w-65 md:w-150 lg:w-290">
</div>


        <h1 className="font-montserrat  text-center mt-6 text-[10px] sm:text-3xl lg:text-2xl
                       text-gray-700 tracking-wide leading-relaxed max-w-4xl mx-auto px-4">
          Drop your number and our experts will reach out to you soon !
        </h1>


        <form
  onSubmit={handleSubmit}
  className="
    max-w-3xl 
    h-auto lg:h-70 mt-6 lg:mt-20 
    mx-auto          /* ✅ this centers it */
    bg-gradient-to-tr from-[#e6d9c3] to-[#f5f5dc] 
    p-6 rounded-xl shadow-[0_8px_30px_rgba(90,77,65,0.50)] border border-[#e5e5c0] 
    grid grid-cols-1 md:grid-cols-2 gap-6
  "
>

          {/* First Name */}
          <div>

            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your first name"
              className="w-full border-b-2 border-[#5a4d41] bg-transparent focus:outline-none focus:border-[#4a3f35] py-2 text-gray-800 placeholder-gray-500"
            />
          </div>

          {/* Phone Number */}
          <div>

            <Input
              type="tel"
              value={usernumber}
              onChange={(e) => setnumber(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full border-b-2 border-[#5a4d41] bg-transparent focus:outline-none focus:border-[#4a3f35] py-2 text-gray-800 placeholder-gray-500"
            />
          </div>

          {/* Date */}
          <div className="relative w-full">
            <label
              htmlFor="dateInput"
              className={`absolute left-3 top-2 text-gray-500 lg:text-transparent md:text-transparent text-sm pointer-events-none
              ${usedate ? "hidden" : "block"}`}
            >
              Select your preferred date
            </label>

            <Input
              id="date"
              type="date"
              value={usedate}
              onChange={(e) => setdate(e.target.value)}
              className="w-full border-b-2 border-[#5a4d41] bg-transparent focus:outline-none focus:border-[#4a3f35] py-2 text-gray-800 relative z-10"
            />
          </div>


          {/* Time */}
          <div>

            <Input
              type="time"
              value={usetime}
              onChange={(e) => setusertime(e.target.value)}
              min="09:00"
              max="17:00"
              step="60"
              className="w-full border-b-2 border-[#5a4d41] bg-transparent focus:outline-none focus:border-[#4a3f35] py-2 text-gray-800"
            />
          </div> 

          {/* Submit Button spanning full width */}
          <div className="md:col-span-2">
            <Button
              type="submit"
              className="w-full mt-4 bg-[#5a4d41] hover:bg-[#4a3f35] text-white font-semibold py-3 px-4 rounded transition"
              
            >Submit</Button>
          </div>
        </form>
        <h3 className="font-montserrat py-4 text-center text-xs sm:text-sm lg:text-base max-w-3xl mx-auto px-4">
          By signing up, you agree to receive call from our expert astrologers at the phone number provided. View our privacy policy and terms of service for more info.
        </h3>
      </div>
    </>
  )
}

export default HelpingForm;