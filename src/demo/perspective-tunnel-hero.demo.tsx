// Demo for PerspectiveTunnelHero. Rendered full-width (the hero is 100svh tall and full-width,
// so it must not sit inside a max-width wrapper).
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";

export default function DemoOne() {
    return (
        <main className="min-h-screen w-full bg-[#FFFDF3]">
            <PerspectiveTunnelHero />
        </main>
    );
}
