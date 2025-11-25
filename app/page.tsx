"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Zap } from "lucide-react";

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
    setResult(null);

    if (!goal.trim()) {
      setError("Please enter a goal.");
      return;
    }

    setLoading(true);

    try {
     
      const response = await axios.post("/api", { goal });

      setResult({
        originalGoal: goal,
        breakdown: response.data,
      });
    } catch (err: any) {
      setError(err.response?.data?.error || "Backend returned an error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-xl">

        <header className="py-6 text-center">
          <h1 className="text-4xl font-bold flex justify-center items-center gap-2">
            <Zap className="w-6 h-6 text-indigo-600" /> Smart Goal Breaker
          </h1>
        </header>

        <Card className="mb-8 shadow-md">
          <CardHeader>
            <CardTitle>Enter Your Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                placeholder="e.g., Build a SaaS app"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
              <Button disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing
                  </>
                ) : (
                  "Break It Down"
                )}
              </Button>
            </form>

            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardContent>
        </Card>

        {result && (
          <Card className="shadow-md border-l-4 border-indigo-600">
            <CardHeader>
              <CardTitle className="text-indigo-600">
                Action Plan: "{result.originalGoal}"
              </CardTitle>
              <CardDescription>Generated sub-tasks:</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-semibold mb-4">
                Complexity Score: {result.breakdown.complexity_score}/10
              </p>

              <ul className="space-y-2">
                {result.breakdown.sub_tasks.map((task, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-bold text-indigo-600">{i + 1}.</span>
                    <span>{task}</span>
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
