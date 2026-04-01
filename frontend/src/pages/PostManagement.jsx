import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";

const PostManagement = () => {
  // Mock data for posts
  const posts = [
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
            <h1 className="text-3xl font-bold">Post Management</h1>
            <p className="text-muted-foreground">
              Manage your blog posts and announcements
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Post
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>By {post.author}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{post.views} views</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={post.status === "published" ? "default" : "secondary"}>
                      {post.status}
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
                      <Button variant="outline" size="sm">
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

export default PostManagement;
