import React from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const SkinPreferencesTab: React.FC = React.memo(() => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin làn da</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Tính năng này đang được phát triển. Bạn sẽ sớm có thể quản lý loại da, mối quan tâm và sở thích sản phẩm của
          mình tại đây.
        </p>
      </CardContent>
    </Card>
  );
});
