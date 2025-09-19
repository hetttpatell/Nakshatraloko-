import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Star, Shield, Bell, Moon, Sun, Zap, CreditCard, MapPin, Heart, Smartphone, UserCog } from "lucide-react";
import axios from "axios";
import { FaMobile } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Add this import

export default function UserAccount() {
  const [user, setUser] = useState({
    name: "",        // ✅ fullname
    email: "",       // ✅ email
    phone: "",       // ✅ phone
    birthDate: "",   // ✅ BirthDate
    birthTime: "",   // ✅ BirthTime
    birthPlace: "",  // ✅ BirthPlace
    gender: "",      // ✅ Gender
    address: "",     // ✅ Address
    fullNameAtBirth: "", // ✅ FullNameAtBirth
    membership: ""   // ✅ Add membership/role to state
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  // ✅ Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.post(
          "http://localhost:8001/api/user/profile",
          {},
          { headers: { Authorization: `${token}` } }
        );

        if (res.data.success && res.data.user) {
          const userData = res.data.user;
          setUser((prev) => ({
            ...prev,
            name: userData.fullname || "",
            email: userData.email || "",
            phone: userData.phone || "",
            birthDate: userData.BirthDate || "",
            birthTime: userData.BirthTime || "",
            birthPlace: userData.BirthPlace || "",
            gender: userData.Gender || "",
            address: userData.Address || "",
            fullNameAtBirth: userData.FullNameAtBirth || "",
            membership: userData.role || "customer"
          }));
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEditMode(false);

    try {
      const token = localStorage.getItem("authToken");

      const payload = {
        fullname: user.name,
        email: user.email,
        phone: user.phone,
        BirthDate: user.birthDate,
        BirthPlace: user.birthPlace,
        BirthTime: user.birthTime,
        Gender: user.gender,
        Address: user.address,
        FullNameAtBirth: user.fullNameAtBirth || "",
      };

      const res = await axios.post(
        "http://localhost:8001/api/updateUser",
        payload,
        {
          headers: { Authorization: `${token}` },
        }
      );

      if (res.data.success) {
        // alert("Profile updated successfully!");
        // Optionally fetch updated data again from server
      } else {
        // alert(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Failed to update user:", err);
      // alert(err.response?.data?.message || "Something went wrong");
    }
  };

  // Function to handle admin panel navigation
  const handleAdminPanelClick = () => {
    navigate("/admin"); // Adjust the path to your admin panel route
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-playfair font-bold text-[var(--color-text)] mb-2">
            Your Cosmic Profile
          </h1>
          <p className="text-[var(--color-text-light)] max-w-2xl mx-auto">
            Manage your account and astrological preferences
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            className="lg:w-1/4 bg-white rounded-xl shadow-[var(--shadow-sm)] p-6 h-fit"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-[var(--color-primary-light)] flex items-center justify-center mb-4">
                <User size={40} className="text-[var(--color-primary)]" />
              </div>
              <h2 className="font-bold text-lg text-[var(--color-text)]">{user.name}</h2>
              <div className="inline-flex items-center gap-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 rounded-full mt-2">
                <Shield size={12} />
                <span className="text-xs font-medium">{user.membership} Member</span>
              </div>
            </div>

            <nav className="space-y-2">
              {[
                { id: "profile", label: "Profile", icon: User },
                // { id: "astrology", label: "Astrological Profile", icon: Star },
                // { id: "notifications", label: "Notifications", icon: Bell },
                // { id: "billing", label: "Billing", icon: CreditCard },
                // { id: "address", label: "Shipping Address", icon: MapPin },
                // { id: "wishlist", label: "Wishlist", icon: Heart },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === item.id
                    ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                    : "text-[var(--color-text-light)] hover:bg-[var(--color-primary-light)]"
                    }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
              
              {/* Admin Panel Button - Conditionally Rendered */}
              {user.membership === "admin" && (
                <button
                  onClick={handleAdminPanelClick}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors text-[var(--color-text-light)] hover:bg-[var(--color-primary-light)]"
                >
                  <UserCog size={18} />
                  <span>Admin Panel</span>
                </button>
              )}
            </nav>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="lg:w-3/4 bg-white rounded-xl shadow-[var(--shadow-sm)] p-6 md:p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-playfair font-bold text-[var(--color-text)]">
                {activeTab === "profile" && "Personal Information"}
              </h2>
              {activeTab === "profile" && (
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
                >
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
              )}
            </div>

            {activeTab === "profile" && (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Full Name</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="text"
                        name="name"
                        value={user.name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="email"
                        name="email"
                        value={user.email}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Phone Number</label>
                    <div className="relative">
                      <Smartphone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="tel"
                        name="phone"
                        value={user.phone}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>

                  {/* Birth Date */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Birth Date</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="date"
                        name="birthDate"
                        value={user.birthDate}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>

                  {/* Birth Time */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Birth Time</label>
                    <div className="relative">
                      <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="time"
                        name="birthTime"
                        value={user.birthTime}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>

                  {/* Birth Place */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Birth Place</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="text"
                        name="birthPlace"
                        value={user.birthPlace}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Gender</label>
                    <select
                      name="gender"
                      value={user.gender}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="w-full p-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Full Name (Real Name)</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="text"
                        name="fullNameAtBirth"
                        value={user.fullNameAtBirth}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Address</label>
                    <div className="relative">
                      <MapPin size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                      <input
                        type="text"
                        name="address"
                        value={user.address}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="Enter Your Address"
                        className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                {editMode && (
                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-6 py-2 border border-[var(--color-border)] rounded-lg text-[var(--color-text)] hover:bg-[var(--color-background)] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}