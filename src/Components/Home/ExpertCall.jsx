import React, { useState, useContext } from "react";
import { Phone, X } from "lucide-react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { FaWhatsapp } from "react-icons/fa";
import ConsultancyContext from "../../Context/ConsultancyContext";
import Toast from "../Product/Toast";

function ExpertCall({ className = "" }) {
    const { addSubmission } = useContext(ConsultancyContext);
    const [open, setOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [usernumber, setNumber] = useState("");
    const [consultationTime, setConsultationTime] = useState("09:00");
    const [consultationDate, setConsultationDate] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [birthTime, setBirthTime] = useState("");
    const [birthPlace, setBirthPlace] = useState("");
    const [gender, setGender] = useState("");
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create submission object
        const submission = {
            formType: "ExpertCall",
            username,
            phone: usernumber,
            date: consultationDate,
            time: consultationTime,
            birthDate,
            birthTime,
            birthPlace,
            gender,
            status: "new",
        };

        addSubmission(submission);

        // Store in localStorage for admin access
        const existingSubmissions = JSON.parse(localStorage.getItem('consultancySubmissions') || '[]');
        const updatedSubmissions = [...existingSubmissions, submission];
        localStorage.setItem('consultancySubmissions', JSON.stringify(updatedSubmissions));

        // Send to WhatsApp
        const clientWhatsapp = "918866378552";
        const message = `New Consultation Request:
Name: ${username}
Phone: ${usernumber}
Birth Date: ${birthDate}
Birth Time: ${birthTime}
Birth Place: ${birthPlace}
Gender: ${gender}
Preferred Consultation Date: ${consultationDate}
Preferred Consultation Time: ${consultationTime}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${clientWhatsapp}?text=${encodedMessage}`;
        window.open(whatsappURL, "_blank");

        // Show toast instead of alert
        setToastMessage("Thank you! Our experts will reach out to you soon.");
        setToastType("success");
        setShowToast(true);

        // Reset form and close modal
        setUsername("");
        setNumber("");
        setConsultationDate("");
        setConsultationTime("09:00");
        setBirthDate("");
        setBirthTime("");
        setBirthPlace("");
        setGender("");
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
                            className="absolute top-4 right-4 p-2 rounded-full 
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
                            className="max-w-3xl h-auto 
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
                                    Full Name *
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

                            {/* Phone Number */}
                            <div className="w-full">
                                <label
                                    htmlFor="phoneNumber"
                                    className="block text-sm font-medium text-gray-600 mb-1"
                                >
                                    Phone Number *
                                </label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    value={usernumber}
                                    onChange={(e) => setNumber(e.target.value)}
                                    placeholder="Enter your phone number"
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
                                    Birth Date *
                                </label>
                                <Input
                                    id="birthDate"
                                    type="date"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="w-full border-b-2 border-[#5a4d41] bg-transparent 
                                        focus:outline-none focus:border-[#4a3f35] py-2 
                                        text-gray-800"
                                    required
                                />
                            </div>

                            {/* Birth Time */}
                            <div className="w-full">
                                <label
                                    htmlFor="birthTime"
                                    className="block text-sm font-medium text-gray-600 mb-1"
                                >
                                    Birth Time *
                                </label>
                                <Input
                                    id="birthTime"
                                    type="time"
                                    value={birthTime}
                                    onChange={(e) => setBirthTime(e.target.value)}
                                    className="w-full border-b-2 border-[#5a4d41] bg-transparent 
                                        focus:outline-none focus:border-[#4a3f35] py-2 
                                        text-gray-800"
                                    required
                                />
                            </div>

                            {/* Birth Place */}
                            <div className="w-full">
                                <label
                                    htmlFor="birthPlace"
                                    className="block text-sm font-medium text-gray-600 mb-1"
                                >
                                    Birth Place *
                                </label>
                                <Input
                                    id="birthPlace"
                                    type="text"
                                    value={birthPlace}
                                    onChange={(e) => setBirthPlace(e.target.value)}
                                    placeholder="Enter your birth place"
                                    className="w-full border-b-2 border-[#5a4d41] bg-transparent 
                                        focus:outline-none focus:border-[#4a3f35] py-2 
                                        text-gray-800 placeholder-gray-500"
                                    required
                                />
                            </div>

                            {/* Gender */}
                            <div className="w-full">
                                <label
                                    htmlFor="gender"
                                    className="block text-sm font-medium text-gray-600 mb-1"
                                >
                                    Gender *
                                </label>
                                <select
                                    id="gender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full border-b-2 border-[#5a4d41] bg-transparent
                                        focus:outline-none focus:border-[#4a3f35] py-2 px-1
                                        text-gray-800 cursor-pointer"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* Preferred Consultation Date */}
                            <div className="w-full">
                                <label
                                    htmlFor="consultationDate"
                                    className="block text-sm font-medium text-gray-600 mb-1"
                                >
                                    Preferred Consultation Date
                                </label>
                                <Input
                                    id="consultationDate"
                                    type="date"
                                    value={consultationDate}
                                    onChange={(e) => setConsultationDate(e.target.value)}
                                    className="w-full border-b-2 border-[#5a4d41] bg-transparent 
                                        focus:outline-none focus:border-[#4a3f35] py-2 
                                        text-gray-800"
                                />
                            </div>

                            {/* Preferred Consultation Time */}
                            <div className="w-full">
                                <label
                                    htmlFor="consultationTime"
                                    className="block text-sm font-medium text-gray-600 mb-1"
                                >
                                    Preferred Consultation Time
                                </label>
                                <Input
                                    id="consultationTime"
                                    type="time"
                                    value={consultationTime}
                                    onChange={(e) => setConsultationTime(e.target.value)}
                                    min="09:00"
                                    max="17:00"
                                    className="w-full border-b-2 border-[#5a4d41] bg-transparent 
                                        focus:outline-none focus:border-[#4a3f35] py-2 
                                        text-gray-800"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="md:col-span-2">
                                <Button
                                    type="submit"
                                    className="w-full mt-4 bg-[#5a4d41] hover:bg-[#4a3f35] text-white font-semibold py-3 px-4 rounded transition"
                                >
                                    Submit & Chat on WhatsApp
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
            {showToast && (
                <Toast
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}
        </>
    );
}

export default ExpertCall;