import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductTabsProps {
  details: string;
  ingredients: string;
  usage: string;
}

export function ProductTabs({ details, ingredients, usage }: ProductTabsProps) {
  return (
    <Card className="mb-12">
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b">
          <TabsTrigger
            value="details"
            className="data-[state=active]:border-primary rounded-none data-[state=active]:border-b-2"
          >
            Chi tiết
          </TabsTrigger>
          <TabsTrigger
            value="ingredients"
            className="data-[state=active]:border-primary rounded-none data-[state=active]:border-b-2"
          >
            Thành phần
          </TabsTrigger>
          <TabsTrigger
            value="usage"
            className="data-[state=active]:border-primary rounded-none data-[state=active]:border-b-2"
          >
            Hướng dẫn sử dụng
          </TabsTrigger>
        </TabsList>
        <CardContent className="pt-6">
          <TabsContent value="details">
            <p>{details}</p>
          </TabsContent>
          <TabsContent value="ingredients">
            <p>{ingredients}</p>
          </TabsContent>
          <TabsContent value="usage">
            <p>{usage}</p>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
