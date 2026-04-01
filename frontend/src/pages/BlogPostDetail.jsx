import { useParams, Link } from "react-router-dom";
import { blogPosts } from "@/data/mockData";
import { ArrowLeft } from "lucide-react";
import CommentSection from "@/components/CommentSection";

const BlogPostDetail = () => {
  const { id } = useParams();
  const post = blogPosts.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <Link to="/blog">
            <button className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock comments for this article
  const mockComments = [
    {
      id: "1",
      text: "Great article! Very informative about the new canteen openings.",
      author: "Student A",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likes: 12,
      articleId: id
    },
    {
      id: "2", 
      text: "The food quality has really improved this semester. Keep up the good work!",
      author: "Student B",
      createdAt: new Date(Date.now() - 43200000).toISOString(),
      likes: 8,
      articleId: id
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Link to="/blog" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="h-64 w-full object-cover rounded-lg mb-6"
            />
            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>By {post.author}</span>
              <span>•</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none mb-8">
            {post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>

          <CommentSection articleId={id} comments={mockComments} />
        </article>
      </div>
    </div>
  );
};

export default BlogPostDetail;
