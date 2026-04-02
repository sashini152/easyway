import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, User, FileText } from "lucide-react";
import { articleAPI } from "@/services/api";
import { Badge } from "@/components/ui/badge";

const BlogPostDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await articleAPI.getArticleById(id);
        if (response.success) {
          setArticle(response.data);
        }
      } catch (error) {
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-4">The article you're looking for doesn't exist.</p>
          <Link to="/admin/news">
            <button className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/admin/news" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>

        <article className="prose prose-lg max-w-none">
          <header className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                {article.category}
              </Badge>
              <Badge className={
                article.status === 'published' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }>
                {article.status}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author?.name || 'Super Admin'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </header>

          {article.image && (
            <div className="mb-8">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="mb-8">
            {article.excerpt && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 italic border-l-4 border-blue-500">
                {article.excerpt}
              </div>
            )}
            
            <div className="prose-content">
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <footer className="border-t pt-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Published on {new Date(article.publishedAt || article.createdAt).toLocaleDateString()}
              </div>
              <div className="flex gap-4">
                <span className="text-sm text-muted-foreground">
                  {article.views || 0} views
                </span>
                <span className="text-sm text-muted-foreground">
                  {article.likes?.length || 0} likes
                </span>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default BlogPostDetail;
