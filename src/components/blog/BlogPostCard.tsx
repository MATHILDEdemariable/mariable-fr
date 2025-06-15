
import React from 'react';
import { BlogPost } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
  return (
    <section 
        className="h-screen w-screen flex flex-col items-center justify-center relative snap-start"
        style={{
            backgroundImage: `url(${post.background_image_url})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
    >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative z-10 text-white text-center p-8 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {post.h1_title || post.title}
            </h1>
            <p className="text-xl md:text-2xl mb-8">
                {post.subtitle}
            </p>
            <Button>
                Lire l'article
            </Button>
        </div>
        <div className="absolute bottom-8 text-white animate-bounce">
            <ArrowDown size={32} />
        </div>
    </section>
  );
};

export default BlogPostCard;
