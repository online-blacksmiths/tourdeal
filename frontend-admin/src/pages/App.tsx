import { Button } from "@/components/shared/Button";
import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1 className="font-thin text-4xl">Hello World</h1>
      <Button onClick={() => setCount((prev) => prev + 1)}>Click me</Button>
      <p>{count}</p>
    </div>
  );
}
