import {
  Card,
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
      <CardHeader>
        <CardTitle>Dragonborn's Quest</CardTitle>
        <CardDescription>
          A new quest has been added to your journal.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[oklch(0.65_0.01_80)]">
          Travel to High Hrothgar and speak with the Greybeards to learn the Way
          of the Voice.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button>Accept</Button>
        <Button variant="outline">Decline</Button>
      </CardFooter>
    </Card>
  );
}
