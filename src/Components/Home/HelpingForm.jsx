import React, { useState } from "react";
import Input from "../Input/Input";

function HelpingForm() {
  const [firstName, setFirstName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("First Name:", firstName);
    console.log("Phone Number:", phoneNumber);
    // you can send data to backend or API here
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 sm:px-12 lg:px-40">
      
      {/* Headings */}
      <h1 className="font-playfair font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center mb-4">
        Having Trouble
      </h1>
      <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-center mb-8">
        What To Buy?
      </h2>

      {/* Subtext */}
      <p className="font-montserrat font-bold text-center mb-6 text-gray-700 text-sm sm:text-lg lg:text-xl max-w-2xl">
        Drop your number and our experts will reach out to you soon!
      </p>

      {/* Form */}
      <form 
        onSubmit={handleSubmit} 
        className="w-full max-w-md bg-[var(--color-aboutbg)] p-6 rounded-2xl shadow-md"
      >
        <Input
          type="text"
          label="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Enter your first name"
          className="h-12 bg-[#e5e5c0]"
        />

        <Input
          type="tel"
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Enter your phone number"
          className="h-12 bg-[#e5e5c0]"
        />

        <button 
          type="submit" 
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default HelpingForm;
