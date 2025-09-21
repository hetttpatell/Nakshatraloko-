// import React, { useState } from "react";
// import axios from "axios";
// import Input from "../Input/Input";

// const SignupForm = ({ onClose }) => {
//   const [fullname, setFullname] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password_hash, setPassword_hash] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSignup = async (e) => {
//     e.preventDefault();

//     // Validate required fields
//     if (!fullname || !email || !phone || !password_hash) {
//       setError("All fields are required");
//       return;
//     }

//     // Validate password strength (at least 6 characters)
//     if (password_hash.length < 6) {
//       setError("Password must be at least 6 characters long");
//       return;
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     // Validate phone number format (basic validation)
//     const phoneRegex = /^[0-9]{10}$/;
//     if (!phoneRegex.test(phone.replace(/\D/g, ""))) {
//       setError("Please enter a valid 10-digit phone number");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post("${BACKEND_URL}saveUser", {
//         fullname: fullname,
//         email: email,
//         phone: phone.replace(/\D/g, ""), // only digits
//         password_hash: password_hash,
//       });

//       console.log("Signup success:", response.data);

//       if (response.data.success) {
//         onClose(); // close modal after success
//       } else {
//         setError(response.data.errors?.[0]?.msg || "Signup failed");
//       }
//     } catch (err) {
//       console.error("Signup failed:", err);
//       setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
//       {/* Background overlay */}
//       <div
//         className="absolute inset-0 bg-black/30 backdrop-blur-sm"
//         onClick={onClose}
//       ></div>

//       {/* Modal */}
//       <div className="relative bg-[var(--color-surface)] w-[95%] max-w-md p-8 rounded-2xl shadow-xl z-10 border border-[var(--color-border)]">
//         {/* Close button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-[var(--color-text-muted)] font-bold text-lg rounded-full hover:bg-[var(--color-primary)] hover:text-white transition-all duration-300 ease-in-out shadow-sm hover:shadow-md"
//         >
//           ✕
//         </button>

//         {/* Title */}
//         <h2 className="text-2xl font-bold mb-6 text-center text-[var(--color-text)]">
//           Create Account
//         </h2>

//         {/* Form */}
//         <form onSubmit={handleSignup} className="space-y-5">
//           <Input
//             type="text"
//             label="Full Name"
//             placeholder="Enter your full name"
//             value={fullname}
//             onChange={(e) => setFullname(e.target.value)}
//             required
//           />

//           <Input
//             type="email"
//             label="Email Address"
//             placeholder="Enter your email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />

//           <Input
//             type="tel"
//             label="Phone Number"
//             placeholder="Enter your 10-digit phone number"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             required
//           />

//           <Input
//             type="password"
//             label="Password"
//             placeholder="Enter your password (min. 6 characters)"
//             value={password_hash}
//             onChange={(e) => setPassword_hash(e.target.value)}
//             required
//           />

//           {error && (
//             <p className="text-[var(--color-accent-red)] text-sm text-center p-2 bg-red-50 rounded-md">
//               {error}
//             </p>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[var(--color-primary)] text-white py-3 font-semibold rounded-lg hover:bg-[var(--color-primary-dark)] transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg"
//           >
//             {loading ? (
//               <span className="flex items-center justify-center">
//                 <svg
//                   className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   ></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Signing up...
//               </span>
//             ) : (
//               "SIGN UP"
//             )}
//           </button>
//         </form>

//         <p className="text-xs text-[var(--color-text-muted)] mt-6 text-center">
//           By signing up, you agree to our{" "}
//           <a
//             href="#"
//             className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-dark)]"
//           >
//             Terms of Use
//           </a>{" "}
//           &{" "}
//           <a
//             href="#"
//             className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-dark)]"
//           >
//             Privacy Policy
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignupForm;
import React from "react";

export default function SignupForm(){
  return (
    <>
      
    </>
  )
}