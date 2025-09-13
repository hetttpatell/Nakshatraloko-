// ConsultationForm.jsx - Mobile-optimized version
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Calendar, Clock, User, MessageCircle } from "lucide-react";
import axios from "axios";
import Toast from "../Product/Toast";

export default function ConsultationForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    date: "",
    time: "09:00"
  });

  const [toast, setToast] = useState({
    message: "",
    type: "success",
    visible: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("authToken");

      // ✅ Match backend field names
      const payload = {
        fullName: formData.name,
        phoneNumber: formData.phone,
        bookingDate: formData.date,
        bookingTime: formData.time,
        status: "Pending",            // default value
        consultationType: "General",  // example type
        isActive: true
      };

      const response = await axios.post(
        "http://localhost:8001/api/saveConsultation",
        payload,
        { headers: { Authorization: `${token}` } }
      );

      if (response.data.success) {
        setToast({
          message: "Consultation saved successfully!",
          type: "success",
          visible: true,
        });
        setFormData({ name: "", phone: "", date: "", time: "09:00" });
      } else {
        setToast({
          message: "Failed to save consultation.",
          type: "error",
          visible: true,
        });
      }
    } catch (error) {
      console.error("Error submitting consultation:", error);
      setToast({
        message: "Something went wrong.",
        type: "error",
        visible: true,
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-12 md:py-20 bg-[var(--color-background-alt)]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-4 py-2 rounded-full mb-4">
              <MessageCircle size={16} />
              <span className="text-sm font-medium">Personal Consultation</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-text)] mb-4">
              Need Guidance? <span className="text-[var(--color-primary)]">We're Here</span>
            </h2>

            <p className="text-base md:text-lg text-[var(--color-text-light)] max-w-2xl mx-auto">
              Our experts are ready to help you.
            </p>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl md:rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row">
              {/* Form Section */}
              <div className="md:w-full p-6 md:p-8 lg:p-12">
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" size={18} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        className="w-full pl-10 pr-4 py-2.5 md:py-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition text-sm md:text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" size={18} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className="w-full pl-10 pr-4 py-2.5 md:py-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition text-sm md:text-base"
                        required
                      />
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Preferred Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" size={18} />
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 md:py-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition text-sm md:text-base"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
                        Preferred Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" size={18} />
                        <select
                          name="time"
                          value={formData.time}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 md:py-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition text-sm md:text-base appearance-none"
                          required
                        >
                          <option value="09:00">9:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="13:00">1:00 PM</option>
                          <option value="14:00">2:00 PM</option>
                          <option value="15:00">3:00 PM</option>
                          <option value="16:00">4:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-[var(--color-primary)] text-white font-medium rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors shadow-md hover:shadow-lg text-sm md:text-base"
                  >
                    Schedule Free Consultation
                  </button>
                </form>

                {/* ✅ Toast Rendering */}
                {toast.visible && (
                  <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ ...toast, visible: false })}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
