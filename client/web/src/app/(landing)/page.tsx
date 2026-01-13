import Hero from "@/components/sections/hero";
import { Pricing } from "@/components/sections/pricing/pricing";

export default function Home() {
  const auth = true;
  return (
    <>
      <Hero />
      <Pricing />
    </>
  );
}
