import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";

const ArticleManagement = () => {
  // Mock data for articles
  const articles = [
    {
      id: "1",
      title: "New Canteen Opening at Engineering Faculty",
      excerpt: "We're excited to announce the opening of our new canteen...",
      author: "Admin",
      status: "published",
      createdAt: new Date().toISOString(),
      views: 245
    },
    {
      id: "2",
      title: "Special Menu Items for Finals Week",
      excerpt: "Check out our special study menu items...",
      author: "Canteen Manager",
      status: "draft",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      views: 189
    },
    {
      id: "3",
      title: "Holiday Schedule Update",
      excerpt: "Please note the updated holiday hours...",
      author: "Admin",
      status: "published",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      views: 156
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Article Management</h1>
            <p className="text-muted-foreground">
              Create, edit, and manage your blog posts and announcements
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Article
          </Button>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search articles..."
                className="pl-10 w-full p-2 border rounded-md"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articles.map((article) => (
                <div key={article.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>By {article.author}</span>
                      <span>•</span>
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{article.views} views</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={article.status === "published" ? "default" : "secondary"}>
                      {article.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ArticleManagement;
