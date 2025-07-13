import Typography from "@/components/Typography";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface CardDemoProps {
  icon: string;
  title: string;
}

export function CardIcon({ icon, title }: CardDemoProps) {
  return (
    <Card className="w-full cursor-pointer rounded">
      <CardContent>
        <CardTitle>
          <div className="">
            <div className="mb-6 flex items-center justify-center text-xl">
              <span>{icon}</span>
            </div>
            <div className="flex items-center justify-center">
              <Typography className="mb-2 text-sm">{title}</Typography>
            </div>
          </div>
        </CardTitle>
      </CardContent>
    </Card>
  );
}
