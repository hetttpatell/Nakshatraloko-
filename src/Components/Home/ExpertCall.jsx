import React, { useState, useContext, useEffect } from "react";
import { Phone, X } from "lucide-react";
import Input from "../Input/Input";
import Button from "../Button/Button";
import { FaWhatsapp } from "react-icons/fa";
import ConsultancyContext from "../../Context/ConsultancyContext";
import Toast from "../Product/Toast";
import axios from "axios";

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
  const [consultationType, setConsultationType] = useState("");
  const [consultationTypeOptions, setConsultationTypeOptions] = useState([]);
  const [price, setPrice] = useState("");
  const [consultationTypeOptionsFull, setConsultationTypeOptionsFull] =
    useState([]);

  useEffect(() => {
    const fetchConsultationTypes = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8001/api/getAllConsultationsType"
        );
        if (response.data.success && response.data.data) {
          const options = response.data.data.map((item) => ({
            value: item.Name,
            label: item.Name,
          }));
          setConsultationTypeOptions(options);
          setConsultationTypeOptionsFull(response.data.data); // Save full objects
        }
      } catch (error) {
        console.error("Error fetching consultation types:", error);
      }
    };

    fetchConsultationTypes();
  }, []);

  const handleConsultationTypeChange = (e) => {
    const selectedName = e.target.value;
    setConsultationType(selectedName);

    // Find the full object from consultationTypeOptionsFull
    const selectedOption = consultationTypeOptionsFull.find(
      (item) => item.Name === selectedName
    );

    if (selectedOption) {
      setPrice(selectedOption.Price);
    } else {
      setPrice("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log("ff")

    // Create submission object for local use and WhatsApp
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
      status: "Pending",
    };

    try {
      // Call your backend API using Axios
      const response = await axios.post(
        "http://localhost:8001/api/saveConsultation",
        {
          userId: null, // Replace dynamically if needed
          bookingDate:
            consultationDate || new Date().toISOString().split("T")[0],
          status: "Pending",
          isActive: true,
          consultationType: "General", // Or set dynamically
          fullName: username,
          phoneNumber: usernumber,
          dateOfBirth: birthDate,
          birthTime: birthTime,
          gender: gender,
          bookingTime: consultationTime,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to save consultation");
      }

      // Store in localStorage for admin access
      const existingSubmissions = JSON.parse(
        localStorage.getItem("consultancySubmissions") || "[]"
      );
      const updatedSubmissions = [...existingSubmissions, submission];
      localStorage.setItem(
        "consultancySubmissions",
        JSON.stringify(updatedSubmissions)
      );

      // Open WhatsApp chat
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

      // Show toast
      setToastMessage(
        "Thank you! Your consultation has been booked successfully."
      );
      setToastType("success");
      setShowToast(true);

      // Reset form
      setUsername("");
      setNumber("");
      setConsultationDate("");
      setConsultationTime("09:00");
      setBirthDate("");
      setBirthTime("");
      setBirthPlace("");
      setGender("");
      setOpen(false);
    } catch (error) {
      console.error(error);
      setToastMessage(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong. Please try again."
      );
      setToastType("error");
      setShowToast(true);
    }
  };

  //     const handleSubmit = (e) => {
  //         e.preventDefault();

  //         // Create submission object
  //         const submission = {
  //             formType: "ExpertCall",
  //             username,
  //             phone: usernumber,
  //             date: consultationDate,
  //             time: consultationTime,
  //             birthDate,
  //             birthTime,
  //             birthPlace,
  //             gender,
  //             status: "new",
  //         };

  //         addSubmission(submission);

  //         // Store in localStorage for admin access
  //         const existingSubmissions = JSON.parse(localStorage.getItem('consultancySubmissions') || '[]');
  //         const updatedSubmissions = [...existingSubmissions, submission];
  //         localStorage.setItem('consultancySubmissions', JSON.stringify(updatedSubmissions));

  //         // Send to WhatsApp
  //         const clientWhatsapp = "918866378552";
  //         const message = `New Consultation Request:
  // Name: ${username}
  // Phone: ${usernumber}
  // Birth Date: ${birthDate}
  // Birth Time: ${birthTime}
  // Birth Place: ${birthPlace}
  // Gender: ${gender}
  // Preferred Consultation Date: ${consultationDate}
  // Preferred Consultation Time: ${consultationTime}`;

  //         const encodedMessage = encodeURIComponent(message);
  //         const whatsappURL = `https://wa.me/${clientWhatsapp}?text=${encodedMessage}`;
  //         window.open(whatsappURL, "_blank");

  //         // Show toast instead of alert
  //         setToastMessage("Thank you! Our experts will reach out to you soon.");
  //         setToastType("success");
  //         setShowToast(true);

  //         // Reset form and close modal
  //         setUsername("");
  //         setNumber("");
  //         setConsultationDate("");
  //         setConsultationTime("09:00");
  //         setBirthDate("");
  //         setBirthTime("");
  //         setBirthPlace("");
  //         setGender("");
  //         setOpen(false);
  //     };
  return (
    <>
      {/* Floating Button */}
      <div
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--color-primary)] 
                text-white flex items-center justify-center shadow-[var(--shadow-lg)] 
                cursor-pointer hover:bg-[var(--color-primary-dark)] transition z-50 ${className}`}
      >
        {/* Ripple Ring */}
        <span
          className="absolute inline-flex h-full w-full rounded-full 
                    bg-[var(--color-primary-light)] opacity-75 animate-ping duration-700"
        ></span>

        {/* Button Icon */}
        <FaWhatsapp size={24} className="relative z-10 text-white" />
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 flex items-center justify-center
                    bg-black/30 backdrop-blur-xs z-50 px-4"
        >
          <div
            className="bg-[var(--color-background)] 
                        p-6 sm:p-8 rounded-2xl shadow-[var(--shadow-xl)] w-full max-w-2xl relative 
                        border border-[var(--color-border)]
                        max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full 
                                bg-[var(--color-surface)] hover:bg-[var(--color-primary)] 
                                text-[var(--color-text)] hover:text-white 
                                transition shadow-[var(--shadow-md)]"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Title */}
            <h1 className="font-playfair font-bold text-3xl sm:text-4xl md:text-5xl text-center text-[var(--color-primary)] mb-2">
              Book an Appointment
            </h1>
            <p className="font-montserrat text-center text-sm sm:text-base text-[var(--color-text-light)] mb-6 px-2">
              Drop your details and our expert will reach out to you.
            </p>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl h-auto 
                                bg-gradient-to-tr from-[var(--color-surface)] to-[var(--color-background-alt)] 
                                p-6 rounded-xl shadow-[var(--shadow-md)] 
                                border border-[var(--color-border)] 
                                grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {/* Actual Name */}
              <div className="w-full">
                <label
                  htmlFor="actualName"
                  className="block text-sm font-medium text-[var(--color-text)] mb-1"
                >
                  Full Name *
                </label>
                <Input
                  id="actualName"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full border-b-2 border-[var(--color-primary)]/50 bg-transparent 
                                        focus:outline-none focus:border-[var(--color-primary)] py-2 
                                        text-[var(--color-text)] placeholder-[var(--color-text-light)]"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="w-full">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-[var(--color-text)] mb-1"
                >
                  Phone Number *
                </label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={usernumber}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full border-b-2 border-[var(--color-primary)]/50 bg-transparent 
                                        focus:outline-none focus:border-[var(--color-primary)] py-2 
                                        text-[var(--color-text)] placeholder-[var(--color-text-light)]"
                  required
                />
              </div>

              {/* Birth Date */}
              <div className="w-full">
                <label
                  htmlFor="birthDate"
                  className="block text-sm font-medium text-[var(--color-text)] mb-1"
                >
                  Birth Date *
                </label>
                <Input
                  id="birthDate"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full border-b-2 border-[var(--color-primary)]/50 bg-transparent 
                                        focus:outline-none focus:border-[var(--color-primary)] py-2 
                                        text-[var(--color-text)]"
                  required
                />
              </div>

              {/* Birth Time */}
              <div className="w-full">
                <label
                  htmlFor="birthTime"
                  className="block text-sm font-medium text-[var(--color-text)] mb-1"
                >
                  Birth Time *
                </label>
                <Input
                  id="birthTime"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full border-b-2 border-[var(--color-primary)]/50 bg-transparent 
                                        focus:outline-none focus:border-[var(--color-primary)] py-2 
                                        text-[var(--color-text)]"
                  required
                />
              </div>

              {/* Birth Place */}
              <div className="w-full">
                <label
                  htmlFor="birthPlace"
                  className="block text-sm font-medium text-[var(--color-text)] mb-1"
                >
                  Birth Place *
                </label>
                <Input
                  id="birthPlace"
                  type="text"
                  value={birthPlace}
                  onChange={(e) => setBirthPlace(e.target.value)}
                  placeholder="Enter your birth place"
                  className="w-full border-b-2 border-[var(--color-primary)]/50 bg-transparent 
                                        focus:outline-none focus:border-[var(--color-primary)] py-2 
                                        text-[var(--color-text)] placeholder-[var(--color-text-light)]"
                  required
                />
              </div>

              {/* Gender */}
              <div className="w-full">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-[var(--color-text)] mb-1"
                >
                  Gender *
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full border-b-2 border-[var(--color-primary)]/50 bg-transparent
                                        focus:outline-none focus:border-[var(--color-primary)] py-2 px-1
                                        text-[var(--color-text)] cursor-pointer"
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
                  className="block text-sm font-medium text-[var(--color-text)] mb-1"
                >
                  Preferred Consultation Date
                </label>
                <Input
                  id="consultationDate"
                  type="date"
                  value={consultationDate}
                  onChange={(e) => setConsultationDate(e.target.value)}
                  className="w-full border-b-2 border-[var(--color-primary)]/50 bg-transparent 
                                        focus:outline-none focus:border-[var(--color-primary)] py-2 
                                        text-[var(--color-text)]"
                />
              </div>

              {/* Preferred Consultation Time */}
              <div className="w-full">
                <label
                  htmlFor="consultationTime"
                  className="block text-sm font-medium text-[var(--color-text)] mb-1"
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
                  className="w-full border-b-2 border-[var(--color-primary)]/50 bg-transparent 
                                        focus:outline-none focus:border-[var(--color-primary)] py-2 
                                        text-[var(--color-text)]"
                />
              </div>

              {/* Consultation Type Dropdown */}
              <div className="w-full">
                <label
                  htmlFor="consultationType"
                  className="block text-sm font-medium text-[var(--color-text)] mb-1"
                >
                  Consultation Type *
                </label>
                <Input
                  id="consultationType"
                  type="select"
                  value={consultationType}
                  onChange={handleConsultationTypeChange}
                  options={consultationTypeOptions}
                  placeholder="Select Consultation Type"
                  className="w-full border-b-2 border-[var(--color-primary)]/50 bg-transparent 
                    focus:outline-none focus:border-[var(--color-primary)] py-2 
                    text-[var(--color-text)] cursor-pointer"
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="consultationType"
                  className="block text-sm font-medium text-[var(--color-text)] mb-1"
                >
                  Consultation Price *
                </label>

                <Input
                  readOnly
                  id="consultationPrice"
                  type="text"
                  value={price}
                  placeholder="Price will be shown here"
                  className="w-full border-b-2 border-[var(--color-primary)]/50 bg-gray-100 
                focus:outline-none focus:border-[var(--color-primary)] py-2 
                text-[var(--color-text)] cursor-not-allowed"
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2">
                <Button
                  type="submit"
                  className="w-full mt-4 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white font-semibold py-3 px-4 rounded transition shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)]"
                >
                  Submit & Chat on WhatsApp
                </Button>
              </div>
            </form>

            {/* Terms Note */}
            <h3 className="font-montserrat py-4 text-center text-xs sm:text-sm lg:text-base text-[var(--color-text-light)] max-w-2xl mx-auto px-4">
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