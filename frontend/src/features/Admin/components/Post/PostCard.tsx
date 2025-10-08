import { Calendar, Clock, User } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { config } from "@/config/config";
import type { PostUser } from "@/types/post";

interface PostCardProps {
  post: PostUser;
  onClick: () => void;
}
export function PostCard({ post, onClick }: PostCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const totalFilters = [
    ...(post.filter_brand || []),
    ...(post.filter_dac_tinh || []),
    ...(post.filter_hsk_ingredients || []),
    ...(post.filter_hsk_product_type || []),
    ...(post.filter_hsk_size || []),
    ...(post.filter_hsk_skin_type || []),
    ...(post.filter_hsk_uses || []),
    ...(post.filter_origin || []),
  ].length;

  const getPostImage = () => {
    // Debug: Tạm thời log để kiểm tra data
    if (process.env.NODE_ENV === "development") {
      console.log("🖼️ BlogCard Debug:");
      console.log("Post ID:", post._id);
      console.log("Post title:", post.title);
      console.log("Image on list:", post.image_on_list);
      console.log("Image count:", post.image_on_list?.length || 0);
    }

    // Kiểm tra nếu post có image_on_list và có ít nhất 1 ảnh
    if (post.image_on_list && post.image_on_list.length > 0) {
      const imageUrl = post.image_on_list[0];

      if (process.env.NODE_ENV === "development") {
        console.log("✅ Using post image:", imageUrl);
      }

      if (imageUrl.startsWith("http") || imageUrl.startsWith("/")) {
        return imageUrl;
      }

      const cleanImageUrl = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
      const cleanBaseUrl = config.apiBaseUrl.endsWith("/") ? config.apiBaseUrl.slice(0, -1) : config.apiBaseUrl;
      const fullImageUrl = `${cleanBaseUrl}/${cleanImageUrl}`;

      if (process.env.NODE_ENV === "development") {
        console.log("🔗 Full image URL:", fullImageUrl);
      }

      return fullImageUrl;
    }

    // Fallback images nếu không có ảnh
    const fallbackImages = ["/assets/post-1.jpg", "/assets/post-2.jpg", "/assets/post-3.jpg", "/assets/post-hero.jpg"];
    const index = parseInt(post._id.slice(-1), 16) % fallbackImages.length;
    const fallbackImage = fallbackImages[index];

    if (process.env.NODE_ENV === "development") {
      console.log("⚠️ Using fallback image:", fallbackImage);
    }

    return fallbackImage;
  };
  return (
    <Card
      className="group bg-gradient-card hover:shadow-elegant cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      <CardHeader className="relative overflow-hidden">
        <img
          src={getPostImage()}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 h-full w-full bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <Badge
          className={`absolute top-3 right-7 ${
            post.status === "published" ? "bg-green-500/90 hover:bg-green-500" : "bg-yellow-500/90 hover:bg-yellow-500"
          } text-white`}
        >
          {post.status}
        </Badge>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge className="text-xs" variant={"default"}>
            {totalFilters} tags
          </Badge>
        </div>

        <h3 className="group-hover:text-primary mb-2 line-clamp-2 text-lg font-semibold transition-colors">
          {post.title}
        </h3>

        <p className="text-muted-foreground mb-4 line-clamp-3 text-sm">{post.content.plainText.substring(0, 120)}...</p>

        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.created_at)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>5 min read</span>
            </div>
          </div>

          {/* <div className="flex items-center space-x-1">
            <Eye className="h-3 w-3" />
            <span>{post.views}</span>
          </div> */}
        </div>

        {/* Author */}
        <div className="border-border/50 mt-4 flex items-center space-x-2 border-t pt-4">
          <div className="bg-gradient-primary flex h-6 w-6 items-center justify-center rounded-full">
            <User className="h-3 w-3 text-black" />
          </div>
          <span className="text-muted-foreground text-xs">SkinDora Staff</span>
        </div>
      </CardContent>
    </Card>
  );
}
