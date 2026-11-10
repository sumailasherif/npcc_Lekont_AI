import { ExpertChat } from "@/components/expert-chat";

export const instant = false;

export default async function ExpertPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ExpertChat id={id} />;
}
