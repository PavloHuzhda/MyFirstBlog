// BlogList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface BlogPost {
  id: string;
  title: string;
  content: string;
}

const BlogList: React.FC = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await axios.get<{ data: BlogPost[] }>('https://localhost:7046/api/blog');
        console.log("Fetched blog posts:", response.data);
        if (Array.isArray(response.data.data)) {
          setBlogPosts(response.data.data);
        } else {
          console.error("Response data is not an array:", response.data);
          setError("Invalid data format received.");
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        setError("Error fetching blog posts.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Blog List</h2>
      {blogPosts.length > 0 ? (
        <ul>
          {blogPosts.map((blogPost) => (
            <li key={blogPost.id}>{blogPost.title}</li>
          ))}
        </ul>
      ) : (
        <p>No blog posts available.</p>
      )}
    </div>
  );
};

export default BlogList;
