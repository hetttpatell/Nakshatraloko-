import React from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { InstagramLogo } from "phosphor-react";

export default function DetailBlog() {
  const { id } = useParams();

  const blogPosts = [
    {
      id: 1,
      title: "The Power of Zodiac Stones in Daily Life",
      image: "/s1.jpeg",
      author: "Admin",
      date: "August 30, 2025",
      readTime: "4 min read",
      content: [
        "Zodiac stones are more than just beautiful gems—they are believed to align with your astrological sign and amplify positive energies.",
        "Wearing them daily can serve as a reminder of your strengths, aspirations, and inner balance.",
        "Many cultures have used gemstones for centuries to protect, heal, and inspire. Today, zodiac stones continue to be cherished as meaningful companions in one’s journey of self-discovery."
      ]
    },
    {
      id: 2,
      title: "Top 5 Gemstones for Inner Peace & Harmony",
      image: "/s2.jpeg",
      author: "Admin",
      date: "August 25, 2025",
      readTime: "3 min read",
      content: [
        "Gemstones like Amethyst, Aquamarine, and Moonstone are revered for their calming effects.",
        "These stones are often worn to relieve stress, enhance meditation, and bring a sense of clarity.",
        "By wearing or keeping them close, many believe they can restore harmony in both emotional and spiritual well-being."
      ]
    },
    {
      id: 3,
      title: "Caring for Your Zodiac Gemstone Jewelry",
      image: "/s3.jpeg",
      author: "Admin",
      date: "August 18, 2025",
      readTime: "5 min read",
      content: [
        "Gemstone jewelry deserves delicate care to preserve its brilliance.",
        "Clean gently with a soft cloth, avoid harsh chemicals, and store pieces separately to prevent scratches.",
        "With mindful care, your zodiac stones will continue to radiate their natural energy and beauty for years to come."
      ]
    }
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
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto px-6 py-24 mt-[-4rem] relative z-10 rounded-3xl shadow-[0_16px_50px_rgba(90,77,65,0.25)] border border-[#e5e5c0] bg-white"
      >
        {/* Meta */}
        <div className="flex items-center justify-center text-sm text-gray-500 space-x-4 mb-10">
          <span>By {blog.author}</span>
          <span>•</span>
          <span>{blog.date}</span>
          <span>•</span>
          <span>{blog.readTime}</span>
        </div>

        {/* Decorative Header */}
        <div className="flex items-center mb-12 justify-center">
          <div className="w-20 h-1 bg-[#5a4d41] rounded-full mr-4"></div>
          <span className="text-[#5a4d41] uppercase font-semibold tracking-wider text-sm">Featured Blog</span>
          <div className="w-20 h-1 bg-[#5a4d41] rounded-full ml-4"></div>
        </div>

        {/* Blog Paragraphs */}
        <div className="prose prose-lg max-w-none prose-p:font-montserrat prose-headings:font-playfair text-gray-800 leading-relaxed">
          {blog.content.map((para, idx) => (
            <p key={idx}>{para}</p>
          ))}
        </div>

        {/* Floating Quote */}
        <blockquote className="border-l-4 border-[#8b7d6b] pl-6 italic text-[#5a4d41] text-lg md:text-xl my-12 bg-[#fdf6e3] p-4 rounded-lg shadow-sm">
          “Gemstones are not just adornments—they are carriers of energy, emotion, and timeless beauty.”
        </blockquote>

        {/* Social Sharing */}
        {/* Social Sharing */}
<div className="text-center mt-12">
  <h3 className="font-semibold text-gray-700 mb-4 flex items-center justify-center gap-2">
    <Share2 size={18} /> Share this blog
  </h3>
  <div className="flex justify-center space-x-4">
    {/* Twitter */}
    <a
      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(blog.title)}&url=${encodeURIComponent(window.location.href)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-full bg-[#1DA1F2] text-white hover:shadow-lg hover:scale-110 transition-transform"
    >
      <Twitter size={18} />
    </a>

    {/* Facebook */}
    <a
      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-full bg-[#1877F2] text-white hover:shadow-lg hover:scale-110 transition-transform"
    >
      <Facebook size={18} />
    </a>
    <a
  href="https://www.instagram.com/yourbrandusername/" // replace with your IG handle
  target="_blank"
  rel="noopener noreferrer"
  className="p-3 rounded-full bg-gradient-to-tr from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white hover:shadow-lg hover:scale-110 transition-transform"
>    <InstagramLogo size={18} />
  </a>    

    {/* LinkedIn */}
    <a
      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 rounded-full bg-[#0A66C2] text-white hover:shadow-lg hover:scale-110 transition-transform"
    >
      <Linkedin size={18} />
    </a>
  </div>
</div>


        {/* Navigation */}
        <div className="flex justify-between mt-16 text-[#5a4d41] font-semibold">
          {blog.id > 1 ? (
            <Link to={`/blogs/${blog.id - 1}`} className="hover:underline">← Previous</Link>
          ) : <span></span>}

          {blog.id < blogPosts.length ? (
            <Link to={`/blogs/${blog.id + 1}`} className="hover:underline">Next →</Link>
          ) : <span></span>}
        </div>

        {/* Back Link */}
        <div className="text-center mt-10">
          <Link
            to="/blogs"
            className="inline-block px-6 py-3 text-[#5a4d41] font-semibold border-2 border-[#5a4d41] rounded-full transition-all duration-300 hover:bg-[#5a4d41] hover:text-white hover:scale-105"
          >
            ← Back to Blogs
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
