import type { Route } from "./+types/home";
import { WelcomePage } from "~/pages/welcome/WelcomePage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Social App" },
    { name: "description", content: "Social App welcome page" },
  ];
}

export default function Home() {
  return <WelcomePage />;
}
