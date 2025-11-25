import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface GoalBreakdownResult {
  sub_tasks: string[];
  complexity_score: number;
}

export async function POST(req: NextRequest) {
  try {
    const { goal } = await req.json();

    if (!goal || typeof goal !== "string") {
      return NextResponse.json({ error: "Goal is required" }, { status: 400 });
    }

   
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:8000";

    const response = await axios.post<GoalBreakdownResult>(
      `${backendUrl}/break-goal`,
      { goal }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (err) {
    console.error("API Route Error:", err);
    return NextResponse.json(
      { error: "Backend server returned an error." },
      { status: 500 }
    );
  }
}
