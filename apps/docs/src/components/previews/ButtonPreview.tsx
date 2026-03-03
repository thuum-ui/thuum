import { Button } from "../ui/button";

export function ButtonPreview() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="destructive">Destructive</Button>
    </div>
  );
}
