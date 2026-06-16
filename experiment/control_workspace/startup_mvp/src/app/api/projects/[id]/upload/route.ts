import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const CATEGORIES = ["Pricing", "Feature Request", "Bug", "UX/UI", "Performance"];
const SENTIMENTS = ["positive", "neutral", "negative"];

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id, userId: (session.user as any).id },
  });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { feedbacks } = await req.json();

  if (!Array.isArray(feedbacks)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const mockAiProcessedFeedbacks = feedbacks.map((f: any) => ({
    projectId: id,
    content: String(f.content || f.text || JSON.stringify(f)),
    category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    sentiment: SENTIMENTS[Math.floor(Math.random() * SENTIMENTS.length)]
  }));

  await prisma.feedback.createMany({
    data: mockAiProcessedFeedbacks
  });

  return NextResponse.json({ success: true, count: mockAiProcessedFeedbacks.length }, { status: 201 });
}
