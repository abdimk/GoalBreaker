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

   
    const backendUrl = process.env.BACKEND_API_URL;
    
    if (!backendUrl) {
      console.error("BACKEND_API_URL is not set in environment variables.");
      return NextResponse.json({ error: "Server misconfiguration. Backend URL is missing." }, { status: 500 });
    }

    const response = await axios.post<GoalBreakdownResult>(
      `${backendUrl}/break-goal`,
      { goal }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (err) {
    
    
  
    let errorMessage = "Backend server returned an unexpected error.";
    if (axios.isAxiosError(err) && err.response) {
        errorMessage = `Backend error: ${err.response.status} ${err.response.statusText}`;
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}