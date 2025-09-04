import React, { useState } from "react";
import { Phone, X } from "lucide-react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { FaWhatsapp } from "react-icons/fa";

<FaWhatsapp size={24} color="green" />


function ExpertCall({ className = "" }) {
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [usernumber, setnumber] = useState("");
    const [usetime, setusertime] = useState("09:00");
    const [usedate, setdate] = useState("");
    const [gender, setgender] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        const clientWhatsapp = "919974212669"; //919601394272
        const message = `Name: ${username}
Number: ${usernumber}
Birth Date: ${usedate}
Birth Time: ${usetime}
Gender: ${gender}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${clientWhatsapp}?text=${encodedMessage}`;
        window.open(whatsappURL, "_blank");
        setOpen(false);
    };


    return (
        <>
            {/* Floating Button */}
            <div
                onClick={() => setOpen(true)}
                className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--color-navy)] 
    text-[var(--color-productcontainerbg)] flex items-center justify-center shadow-lg 
    cursor-pointer hover:opacity-90 transition z-50 ${className}`}
            >
                {/* Ripple Ring */}
                <span
                    className="absolute inline-flex h-full w-full rounded-full 
  bg-[var(--color-productbg)] opacity-75 animate-ping duration-700"
                ></span>


                {/* Button Icon */}
                <FaWhatsapp size={24} className="relative z-10 text-[var(--color-productcontainerbg)]" />
            </div>


            {/* Modal */}
            {open && (
                <div className="fixed inset-0 flex items-center justify-center
                         bg-black/30 backdrop-blur-xs z-50 px-4">
                    <div className="bg-[var(--color-productcontainerbg)] 
    p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative 
    border border-[var(--color-aboutbg)]
    max-h-[90vh] overflow-y-auto">

                        {/* Close Button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute  top-4 right-4 p-2 rounded-full 
             bg-[var(--color-aboutbg)] hover:bg-[var(--color-navy)] 
             text-[var(--color-navy)] hover:text-[var(--color-productcontainerbg)] 
             transition shadow-md"
                            aria-label="Close"
                        >
                            <X size={18} />
                        </button>


                        {/* Title */}
                        <h1 className="font-playfair font-bold text-3xl sm:text-4xl md:text-5xl text-center text-[var(--color-navy)] mb-2">
                            Book an Appointment
                        </h1>
                        <p className="font-montserrat text-center text-sm sm:text-base text-gray-600 mb-6 px-2">
                            Drop your details and our expert will reach out to you.
                        </p>

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="
                 max-w-3xl 
                 h-auto 
                 bg-gradient-to-tr from-[var(--color-productbg)] to-[var(--color-aboutbg)] 
                 p-6 rounded-xl shadow-[0_8px_30px_rgba(90,77,65,0.35)] 
                 border border-[var(--color-aboutbg)] 
                 grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                            {/* Actual Name */}

                            <div className="w-full">
                                <label
                                    htmlFor="actualName"
                                    className="block text-sm font-medium text-gray-600 mb-1"
                                >
                                    Actual Name
                                </label>
                                <Input
                                    id="actualName"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full border-b-2 border-[#5a4d41] bg-transparent 
               focus:outline-none focus:border-[#4a3f35] py-2 
               text-gray-800 placeholder-gray-500"
                                    required
                                />
                            </div>

                            {/* Birth Date */}
                            <div className="w-full">
                                <label
                                    htmlFor="birthDate"
                                    className="block text-sm font-medium text-gray-600 mb-1"
                                >
                                    Birth Date
                                </label>
                                <Input
                                    id="birthDate"
                                    type="date"
                                    value={usedate}
                                    onChange={(e) => setdate(e.target.value)}
                                    placeholder="Select your birth date"
                                    className="w-full border-b-2 border-[#5a4d41] bg-transparent 
               focus:outline-none focus:border-[#4a3f35] py-2 
               text-gray-800 placeholder-gray-500"
                                    required
                                />
                            </div>

                            {/* Birth Place */}
                            <div>
                                <label
                                    htmlFor="actualName"
                                    className="block text-sm font-medium text-gray-600 mb-1"
                                >
                                    Enter Birth Place
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Enter your birth place"
                                    className="w-full border-b-2 border-[#5a4d41] bg-transparent 
               focus:outline-none focus:border-[#4a3f35] py-2 
               text-gray-800 placeholder-gray-500"
                                    required
                                />
                            </div>

                            {/* Birth Time */}
                            <div>
                                <label
                                    htmlFor="actualName"
                                    className="block text-sm font-medium text-gray-600 mb-1"
                                >
                                    Enter  Birth Time
                                </label>
                                <Input
                                    type="time"
                                    value={usetime}
                                    onChange={(e) => setusertime(e.target.value)}
                                    className="w-full border-b-2 border-[#5a4d41] bg-transparent 
               focus:outline-none focus:border-[#4a3f35] py-2 
               text-gray-800"
                                    required
                                />
                            </div>

                            {/* Gender */}
                            {/* <div>
                <select
                  className="w-full border-b-2 border-[#5a4d41] bg-transparent 
               focus:outline-none focus:border-[#4a3f35] py-2 
               text-gray-800"
                  required
                >
                  <option value="" disabled selected>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div> */}
                            <div className="w-full flex flex-col justify-center">
                                <label
                                    htmlFor="gender"
                                    className="block text-sm font-medium text-gray-600 mb-1"
                                >
                                    Select your Gender
                                </label>
                                <Input
                                    id="gender"
                                    type="select"
                                    value={gender}
                                    onChange={(e) => setgender(e.target.value)}
                                    options={[
                                        { value: "male", label: "Male" },
                                        { value: "female", label: "Female" },
                                        { value: "other", label: "Other" },
                                    ]}
                                    className="w-full border-b-2 border-[#5a4d41] bg-transparent
      focus:outline-none focus:border-[#4a3f35] py-2 px-1
      text-gray-800 placeholder-gray-500 cursor-pointer"
                                    required
                                />
                            </div>


                            {/* Submit Button */}
                            <div className="md:col-span-2">
                                <Button
                                    type="submit"
                                    className="w-full mt-4 bg-[#5a4d41] hover:bg-[#4a3f35] text-white font-semibold py-3 px-4 rounded transition"
                                >
                                    Submit
                                </Button>
                            </div>
                        </form>

                        {/* Terms Note */}
                        <h3 className="font-montserrat py-4 text-center text-xs sm:text-sm lg:text-base text-gray-600 max-w-2xl mx-auto px-4">
                            By submitting, you agree to receive a call from our experts at the
                            phone number provided. View our privacy policy and terms of
                            service for more info.
                        </h3>
                    </div>
                </div>
            )}
        </>
    );
}

export default ExpertCall;

