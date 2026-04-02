import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, Plus, FileText, User } from "lucide-react";
import { articleAPI } from "@/services/api";

const BlogFeed = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Fetch only published articles for public view
        const response = await articleAPI.getAllArticles({ status: 'published' });
        if (response.success) {
          setArticles(response.data.articles || []);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2">Loading articles...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blog & News</h1>
            <p className="text-muted-foreground">
              Latest updates, news, and articles from SLIIT canteens
            </p>
          </div>
          <Link to="/admin/create-article" className="inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Write Article
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No articles yet</h2>
            <p className="text-muted-foreground mb-4">
              Be the first to share news and updates with the community!
            </p>
            <Link 
              to="/admin/create-article"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Write First Article
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Card key={article._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-48 w-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(article.title) + '&background=random&size=400x200';
                    }}
                  />
                ) : (
                  <div className="h-48 w-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-blue-600" />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3" />
                    {new Date(article.createdAt).toLocaleDateString()}
                    <span className="mx-1">•</span>
                    <User className="h-3 w-3" />
                    {article.author?.name || 'Super Admin'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {article.excerpt || article.content?.substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className={
                      article.status === 'published' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }>
                      {article.status}
                    </Badge>
                    <Link 
                      to={`/blog/${article._id}`}
                      className="text-primary hover:underline text-sm font-medium"
                    >
                      Read More →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogFeed;
