import type { Route } from "./+types/posts";
import { UserPostsPage } from "~/pages/users/UserPostsPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Posts do usuário" },
    { name: "description", content: "Lista de posts publicados por um usuário" },
  ];
}

export default function UserPostsRoute({ params }: Route.ComponentProps) {
  return <UserPostsPage userId={params.userId} />;
}
