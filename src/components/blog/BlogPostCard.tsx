
import React from 'react';
import { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  const title = post.h1_title || post.title;
  const words = title.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section 
        className="h-screen w-screen flex flex-col items-center justify-center relative snap-start"
        style={{
            backgroundImage: post.background_image_url ? `url(${post.background_image_url})` : 'none',
            backgroundColor: post.background_image_url ? 'transparent' : '#7F9474',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
    >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-white text-center p-8 max-w-3xl flex flex-col items-center">
            <motion.h1
                className="text-4xl md:text-6xl font-bold mb-4 flex flex-wrap justify-center gap-x-3"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
            >
                {words.map((word, index) => (
                    <motion.span 
                        key={index} 
                        variants={wordVariants}
                        className="whitespace-nowrap"
                    >
                        {word}
                    </motion.span>
                ))}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: words.length * 0.1 + 0.3, duration: 0.5 }}
            >
                {post.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: words.length * 0.1 + 0.5, duration: 0.5 }}
            >
                <Link to={`/blog/${post.slug}`}>
                    <Button>
                        Lire l'article
                    </Button>
                </Link>
            </motion.div>
        </div>
        <div className="absolute bottom-8 text-white animate-bounce">
            <ArrowDown size={32} />
        </div>
    </section>
  );
};

export default BlogPostCard;
