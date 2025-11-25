"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Zap } from "lucide-react"; 
import axios from "axios";

interface GoalBreakdownResult {
  sub_tasks: string[];
  complexity_score: number;
}

export default function Home() {
  const [goal, setGoal] = useState("");
  const [result, setResult] = useState<{ originalGoal: string; breakdown: GoalBreakdownResult } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!goal.trim()) {
      setError("Please enter a goal before breaking it down.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
   
      const response = await axios.post<GoalBreakdownResult>("/api/break-goal", { goal });

      setResult({
        originalGoal: goal,
        breakdown: response.data,
      });
    } catch (err: unknown) {
      console.error("API Call Error:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Backend returned an error.");
      } else {
        setError("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-xl">
       
        <header className="py-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 flex items-center justify-center">
            <Zap className="w-6 h-6 mr-2 text-indigo-600" />
            Smart Goal Breaker
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Turn your vague ambitions into actionable, measurable steps.
          </p>
        </header>

       
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Enter Your Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <Input
                type="text"
                placeholder="e.g., Launch a successful SaaS product in 6 months"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="flex-grow"
                disabled={loading}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Break It Down"
                )}
              </Button>
            </form>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </CardContent>
        </Card>

        
        {result && (
          <Card className="shadow-lg border-l-4 border-indigo-500">
            <CardHeader>
              <CardTitle className="text-indigo-600">
                Action Plan for: &quot;{result.originalGoal}&quot;
              </CardTitle>
              <CardDescription>
                This goal has been broken down into sub-tasks for clarity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                <p className="text-sm font-semibold text-gray-700">
                  Complexity Score: 
                  <span
                    className={`ml-2 font-bold ${
                      result.breakdown.complexity_score > 7
                        ? "text-red-600"
                        : result.breakdown.complexity_score > 4
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    {result.breakdown.complexity_score}/10
                  </span>
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  (Higher score means more sub-tasks and anticipated effort)
                </p>
              </div>

              <h3 className="text-lg font-semibold mb-3 border-b pb-1">Sub-Tasks</h3>
              <ul className="space-y-3">
                {result.breakdown.sub_tasks.map((task, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-indigo-500 font-bold mr-2">{index + 1}.</span>
                    <p className="flex-1">{task}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
