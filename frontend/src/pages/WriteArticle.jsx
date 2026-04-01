import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save } from "lucide-react";

const WriteArticle = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "Article",
    shopName: "Main Canteen",
    image: "https://images.unsplash.com/photo-1542816431-6f3b12f848e?ixlib=rb-4.0.3&ixid=MnW0hc8hhE"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would normally save to backend
    console.log("Article submitted:", formData);
    alert("Article published successfully!");
    navigate("/blog");
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/blog")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Write New Article</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Article Title
                  </label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange("title")(e)}
                    placeholder="Enter article title..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="excerpt" className="text-sm font-medium">
                    Excerpt
                  </label>
                  <Input
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleChange("excerpt")(e)}
                    placeholder="Brief description..."
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => handleChange("category")(e)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Article">Article</option>
                  <option value="News">News</option>
                  <option value="Update">Update</option>
                  <option value="Promotion">Promotion</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="shopName" className="text-sm font-medium">
                  Canteen/Shop
                </label>
                <select
                  id="shopName"
                  value={formData.shopName}
                  onChange={(e) => handleChange("shopName")(e)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Main Canteen">Main Canteen</option>
                  <option value="Engineering Canteen">Engineering Canteen</option>
                  <option value="Business School Canteen">Business School Canteen</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleChange("content")(e)}
                  placeholder="Write your article content here..."
                  className="min-h-[200px]"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Publish Article
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WriteArticle;
