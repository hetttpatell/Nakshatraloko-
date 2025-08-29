import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Blogs() {
  const blogPosts = [
    {
      id: 1,
      title: "The Power of Zodiac Stones in Daily Life",
      excerpt:
        "Discover how zodiac gemstones can influence your energy, bring positivity, and align with your astrological journey.",
      image: "/s1.jpeg",
      category: "Astrology",
      content: "Full blog content about zodiac stones and their power..."
    },
    {
      id: 2,
      title: "Top 5 Gemstones for Inner Peace & Harmony",
      excerpt:
        "From Amethyst to Aquamarine, explore gemstones known for their calming and balancing effects.",
      image: "/s2.jpeg",
      category: "Gemstones",
      content: "Full blog post about inner peace gemstones..."
    },
    {
      id: 3,
      title: "Caring for Your Zodiac Gemstone Jewelry",
      excerpt:
        "Learn the essential tips for keeping your gemstone jewelry radiant, authentic, and full of life.",
      image: "/s3.jpeg",
      category: "Jewelry Care",
      content: "Full blog content about gemstone jewelry care..."
    },
  ];

  return (
    <section className="min-h-screen bg-[var(--color-bg)] py-20 px-6">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h2 className="font-playfair text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#5a4d41] via-[#8b7d6b] to-[#c5b89f] bg-clip-text text-transparent">
          Our Blog
        </h2>
        <p className="mt-4 text-gray-600 font-montserrat text-lg max-w-2xl mx-auto">
          Insights, guides, and stories about gemstones, astrology, and mindful living.
        </p>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <motion.div
            key={post.id}
            whileHover={{ y: -8 }}
            className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(90,77,65,0.15)] border border-[#e5e5c0] overflow-hidden flex flex-col"
          >
            {/* Image */}
            <div className="relative w-full h-56 overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <span className="absolute top-3 left-3 bg-gradient-to-r from-[#5a4d41] to-[#8b7d6b] text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                {post.category}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col p-6">
              <h3 className="font-playfair text-2xl font-semibold text-[#5a4d41] mb-3">
                {post.title}
              </h3>
              <p className="text-gray-600 font-montserrat text-sm leading-relaxed flex-1">
                {post.excerpt}
              </p>

              <Link
                to={`/blog/${post.id}`}
                className="mt-6 inline-flex items-center text-[#5a4d41] font-semibold hover:text-[#8b7d6b] transition"
              >
                Read More <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
