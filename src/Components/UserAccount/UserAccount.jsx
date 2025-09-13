import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Calendar, Star, Shield, Bell, Moon, Sun, Zap, CreditCard, MapPin, Heart } from "lucide-react";

export default function UserAccount() {
  const [user, setUser] = useState({
    name: "Luna Stardust",
    email: "luna@example.com",
    phone: "+1 (555) 123-4567",
    birthDate: "1993-05-15",
    zodiacSign: "Taurus",
    risingSign: "Cancer",
    moonSign: "Scorpio",
    membership: "Premium",
    joinDate: "2023-01-15",
    notifications: true,
    newsletter: false,
    address: "123 Cosmic Avenue, Stellar City, SC 12345"
  });

  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);

  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditMode(false);
    // Here you would typically save the updated user data
    alert("Profile updated successfully!");
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
                { id: "astrology", label: "Astrological Profile", icon: Star },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "billing", label: "Billing", icon: CreditCard },
                { id: "address", label: "Address", icon: MapPin },
                { id: "wishlist", label: "Wishlist", icon: Heart },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                      : "text-[var(--color-text-light)] hover:bg-[var(--color-primary-light)]"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
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
                {activeTab === "astrology" && "Astrological Profile"}
                {activeTab === "notifications" && "Notification Settings"}
                {activeTab === "billing" && "Billing Information"}
                {activeTab === "address" && "Shipping Address"}
              
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
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="w-full p-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                    />
                  </div>
                  
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
                  
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={user.phone}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      className="w-full p-3 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-background)]"
                    />
                  </div>

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

                  {editMode && (
                    <div className="md:col-span-2 flex justify-end gap-4 mt-4">
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
                </div>
              </form>
            )}

            {activeTab === "astrology" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Zodiac Sign</label>
                  <div className="relative">
                    <Sun size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                    <select
                      name="zodiacSign"
                      value={user.zodiacSign}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent appearance-none"
                    >
                      {zodiacSigns.map(sign => (
                        <option key={sign} value={sign}>{sign}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Rising Sign (Ascendant)</label>
                  <div className="relative">
                    <Zap size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                    <select
                      name="risingSign"
                      value={user.risingSign}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent appearance-none"
                    >
                      {zodiacSigns.map(sign => (
                        <option key={sign} value={sign}>{sign}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Moon Sign</label>
                  <div className="relative">
                    <Moon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-light)]" />
                    <select
                      name="moonSign"
                      value={user.moonSign}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent appearance-none"
                    >
                      {zodiacSigns.map(sign => (
                        <option key={sign} value={sign}>{sign}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2 mt-4">
                  <button className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
                    Save Astrological Preferences
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg">
                  <div>
                    <h3 className="font-medium text-[var(--color-text)]">Email Notifications</h3>
                    <p className="text-sm text-[var(--color-text-light)]">Receive order updates and promotions</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={user.notifications}
                      onChange={() => setUser({...user, notifications: !user.notifications})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 border border-[var(--color-border)] rounded-lg">
                  <div>
                    <h3 className="font-medium text-[var(--color-text)]">Newsletter</h3>
                    <p className="text-sm text-[var(--color-text-light)]">Receive our cosmic insights newsletter</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={user.newsletter}
                      onChange={() => setUser({...user, newsletter: !user.newsletter})}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-primary)]"></div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === "address" && (
              <div>
                <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Shipping Address</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-[var(--color-text-light)]" />
                  <textarea
                    name="address"
                    value={user.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 pl-10 border border-[var(--color-border)] rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  />
                </div>
                <button className="mt-4 px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] transition-colors">
                  Save Address
                </button>
              </div>
            )}

          </motion.div>
        </div>
      </div>
    </div>
  );
}