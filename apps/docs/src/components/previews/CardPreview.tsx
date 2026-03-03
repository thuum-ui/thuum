import {
  Card,
  CardCorners,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";

export function CardPreview() {
  return (
    <Card className="w-full max-w-sm">
      <CardCorners />
      <CardHeader>
        <CardTitle>Illusion: Muffle</CardTitle>
        <CardDescription>Spell Tome</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          You move more quietly for 180 seconds.
        </p>
      </CardContent>
      <CardFooter className="gap-4">
        <Button variant="primary">Use</Button>
        <Button>Drop</Button>
      </CardFooter>
    </Card>
  );
}
