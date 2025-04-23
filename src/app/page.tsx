import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main>
      <Button className="m-4">Button</Button>
      <Button variant="secondary" className="m-4">Secondary</Button>
      <Button variant="destructive" className="m-4">Destructive</Button>
    </main>
  );
}
