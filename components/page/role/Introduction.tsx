import PageIntro from "../PageIntro";
import type { PortfolioKey } from "@/lib/portfolio";
export default function Introduction({ role }: { role: PortfolioKey }) {
  return <PageIntro pageKey={role} />;
}
