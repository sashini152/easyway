import { Link } from "react-router-dom";
import { blogPosts } from "@/data/mockData";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowLeft, Plus } from "lucide-react";

const BlogFeed = () => {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Blog & Articles</h1>
            <p className="text-muted-foreground">
              Latest updates, news, and articles from SLIIT canteens
            </p>
          </div>
          <Link to="/blog/new" className="inline-flex items-center gap-2 text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            Write Article
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {post.shopName}
                  </Badge>
                </div>
                <CardDescription className="flex items-center gap-2 text-xs">
                  <Calendar className="h-3 w-3" />
                  {new Date(post.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <Link 
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    Read More →
                  </Link>
                  <Badge variant="outline" className="text-xs">
                    {post.category || "Article"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogFeed;
