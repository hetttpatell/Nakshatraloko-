import React from "react";
import { useParams, Link } from "react-router-dom";

export default function DetailBlog() {
  const { id } = useParams();

  const blogPosts = [
    {
      id: 1,
      title: "The Power of Zodiac Stones in Daily Life",
      image: "/s1.jpeg",
      content:
        "Zodiac stones are more than just beautiful gems—they are believed to align with your astrological sign and amplify positive energies. Wearing them daily can serve as a reminder of your strengths, aspirations, and inner balance. Many cultures have used gemstones for centuries to protect, heal, and inspire. Today, zodiac stones continue to be cherished as meaningful companions in one’s journey of self-discovery."
    },
    {
      id: 2,
      title: "Top 5 Gemstones for Inner Peace & Harmony",
      image: "/s2.jpeg",
      content:
        "Gemstones like Amethyst, Aquamarine, and Moonstone are revered for their calming effects. These stones are often worn to relieve stress, enhance meditation, and bring a sense of clarity. By wearing or keeping them close, many believe they can restore harmony in both emotional and spiritual well-being."
    },
    {
      id: 3,
      title: "Caring for Your Zodiac Gemstone Jewelry",
      image: "/s3.jpeg",
      content:
        "Gemstone jewelry deserves delicate care to preserve its brilliance. Clean gently with a soft cloth, avoid harsh chemicals, and store pieces separately to prevent scratches. With mindful care, your zodiac stones will continue to radiate their natural energy and beauty for years to come."
    },
  ];

  const blog = blogPosts.find((post) => post.id === parseInt(id));

  if (!blog) {
    return <p className="text-center py-20 text-xl font-semibold text-red-600">Blog not found.</p>;
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#fefcf6] to-[#f0e7da]">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden rounded-b-[3rem] shadow-xl">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center">
          <h1 className="font-playfair text-4xl md:text-6xl text-white font-extrabold text-center max-w-3xl mb-16 drop-shadow-2xl tracking-wide animate-fadeIn">
            {blog.title}
          </h1>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-5xl mx-auto px-6 py-24 mt-[-4rem] relative z-10 rounded-3xl shadow-[0_16px_50px_rgba(90,77,65,0.25)] border border-[#e5e5c0] bg-white">
        {/* Decorative Header */}
        <div className="flex items-center mb-12 justify-center">
          <div className="w-20 h-1 bg-[#5a4d41] rounded-full mr-4"></div>
          <span className="text-[#5a4d41] uppercase font-semibold tracking-wider text-sm">Featured Blog</span>
          <div className="w-20 h-1 bg-[#5a4d41] rounded-full ml-4"></div>
        </div>

        {/* Blog Paragraph */}
        <p className="text-gray-800 font-montserrat text-lg md:text-xl leading-relaxed tracking-wide first-letter:text-8xl first-letter:font-playfair first-letter:font-extrabold first-letter:mr-3 first-letter:float-left first-letter:text-[#5a4d41] mb-8">
          {blog.content}
        </p>

        {/* Floating Quote (Optional Premium Touch) */}
        <blockquote className="border-l-4 border-[#8b7d6b] pl-6 italic text-[#5a4d41] text-lg md:text-xl my-12 bg-[#fdf6e3] p-4 rounded-lg shadow-sm">
          “Gemstones are not just adornments—they are carriers of energy, emotion, and timeless beauty.”
        </blockquote>

        {/* Back Link */}
        <div className="text-center mt-10">
          <Link
            to="/blogs"
            className="inline-block px-6 py-3 text-[#5a4d41] font-semibold border-2 border-[#5a4d41] rounded-full transition-all duration-300 hover:bg-[#5a4d41] hover:text-white hover:scale-105"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    </section>
  );
}

