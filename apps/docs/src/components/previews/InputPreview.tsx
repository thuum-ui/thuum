import { Input } from "../ui/input";

export function InputPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <Input placeholder="Enter your name, Dragonborn..." />
      <Input type="email" placeholder="dovahkiin@skyrim.com" />
      <Input disabled placeholder="Disabled input" />
    </div>
  );
}
