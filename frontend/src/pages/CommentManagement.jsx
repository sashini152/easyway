import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Trash2, Edit, Eye, Reply } from "lucide-react";

const CommentManagement = () => {
  // Mock data for comments
  const comments = [
    {
      id: "1",
      text: "Great article! Very informative about the new canteen openings.",
      author: "Student A",
      article: "New Canteen Opening",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: "approved",
      likes: 12,
      replies: 2
    },
    {
      id: "2", 
      text: "The food quality has really improved this semester. Keep up the good work!",
      author: "Student B",
      article: "Food Quality Update",
      createdAt: new Date(Date.now() - 43200000).toISOString(),
      status: "pending",
      likes: 8,
      replies: 1
    },
    {
      id: "3",
      text: "When will the engineering canteen be open?",
      author: "Student C",
      article: "Engineering Canteen Status",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      status: "pending",
      likes: 5,
      replies: 0
    },
    {
      id: "4",
      text: "Spam comment - needs moderation",
      author: "Anonymous",
      article: "Holiday Schedule",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      status: "flagged",
      likes: 0,
      replies: 0
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Comment Management</h1>
            <p className="text-muted-foreground">
              Manage and moderate user comments across all articles
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Moderate Comments
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{comment.author}</span>
                        <Badge variant={comment.status === "approved" ? "default" : comment.status === "pending" ? "secondary" : "destructive"}>
                          {comment.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-2">
                          on "{comment.article}"
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{comment.likes} likes</span>
                        <span>•</span>
                        <span>{comment.replies} replies</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Reply className="h-4 w-4" />
                        Reply
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                        Edit
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

export default CommentManagement;
