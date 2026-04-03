import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Calendar, User, FileText, Eye, Heart, Share2, Clock, Bookmark, MessageCircle, TrendingUp } from "lucide-react";
import { articleAPI } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/admin/news" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>

        <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Hero Image Section */}
          {article.image && (
            <div className="relative h-80 md:h-96 overflow-hidden">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700 backdrop-blur-sm">
                    {article.category}
                  </Badge>
                  <Badge className={
                    article.status === 'published' 
                      ? 'bg-green-100 text-green-700 backdrop-blur-sm' 
                      : 'bg-yellow-100 text-yellow-700 backdrop-blur-sm'
                  }>
                    {article.status}
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{article.title}</h1>
              </div>
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Article Header */}
            <header className="mb-8">
              {!article.image && (
                <>
                  <div className="flex flex-wrap gap-2 mb-4">
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
                  <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">{article.title}</h1>
                </>
              )}
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-b pb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{article.author?.name || 'Super Admin'}</p>
                    <p className="text-xs text-gray-500">Author</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{Math.ceil(article.content.length / 1000)} min read</span>
                </div>
              </div>
            </header>

            {/* Excerpt */}
          {article.excerpt && (
            <Card className="mb-8 bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Summary</h3>
                    <p className="text-blue-800 italic leading-relaxed">{article.excerpt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

            {/* Article Content */}
          <div className="mb-8 prose prose-lg max-w-none">
            <div className="prose-content">
              {article.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-6 text-gray-700 leading-relaxed text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-3 py-1 hover:bg-gray-100 transition-colors">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Engagement Stats */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Eye className="h-5 w-5" />
                    <span className="font-medium">{article.views || 0}</span>
                    <span className="text-sm">views</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Heart className="h-5 w-5" />
                    <span className="font-medium">{article.likes?.length || 0}</span>
                    <span className="text-sm">likes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="h-5 w-5" />
                    <span className="font-medium">{article.comments?.length || 0}</span>
                    <span className="text-sm">comments</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <footer className="border-t pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                <p>Published on {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p className="text-xs mt-1">Last updated {new Date(article.updatedAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-xs">
                  ID: {article._id}
                </Badge>
              </div>
            </div>
          </footer>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPostDetail;
