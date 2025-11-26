"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
      const response = await axios.post<GoalBreakdownResult>("/api", { goal });
      
      setResult({
        originalGoal: goal,
        breakdown: response.data,
      });

    } catch (err) {
      console.error("API Call Error:", err);
      setError("Failed to break down goal. Check Vercel logs for backend connection details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center min-h-screen bg-gray-950 p-6 sm:p-10">
  
      <div className="w-full max-w-2xl">
  
        <header className="py-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tighter text-gray-50 flex items-center justify-center">
            <Zap className="w-8 h-8 mr-3 text-gray-400 transition-transform duration-300 hover:scale-110" /> 
            Smart Goal Breaker
          </h1>
          <p className="mt-4 text-xl text-gray-400 font-light">
            Turn your vague ambitions into actionable, measurable steps.
          </p>
        </header>

      
        <Card className="mb-12 shadow-2xl border border-gray-800 bg-gray-900">
          <CardHeader className="border-b border-gray-800 p-6">
            <CardTitle className="text-2xl font-semibold text-gray-100">Break Down Your Goal</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Input
                type="text"
                placeholder="e.g., Launch a successful SaaS product in 6 months"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="flex-grow p-6 text-base border-2 bg-gray-800 text-white border-gray-700 focus:border-gray-500 transition-colors"
                disabled={loading}
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gray-50 hover:bg-gray-200 text-black shadow-md transition-all duration-200 py-6"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5 mr-1" />
                    Break It Down
                  </>
                )}
              </Button>
            </form>
            {error && <p className="text-red-400 text-sm mt-3 font-medium">{error}</p>}
          </CardContent>
        </Card>


        {result && (
          <Card className="shadow-2xl border-2 border-gray-800/60 hover:shadow-gray-700/40 bg-gray-900 transition-all duration-300">
            <CardHeader className="bg-gray-900 border-b border-gray-800">
              <CardTitle className="text-2xl text-gray-100 font-extrabold">Action Plan for: "{result.originalGoal}"</CardTitle>
              <CardDescription className="text-gray-400">
                This goal has been decomposed into actionable sub-tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded-xl shadow-inner">
                <p className="text-lg font-bold text-gray-50 flex items-center">
                  Complexity Score: 
                  <span className={`ml-3 px-3 py-1 rounded-full font-extrabold text-white 
                    ${result.breakdown.complexity_score > 7 ? 'bg-red-500' : 
                      result.breakdown.complexity_score > 4 ? 'bg-yellow-500' : 
                      'bg-green-500'}`
                  }>
                    {result.breakdown.complexity_score}/10
                  </span>
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  (Score reflects the anticipated effort and number of steps required.)
                </p>
              </div>

              <h3 className="text-xl font-bold mb-4 text-gray-100 border-b-2 border-gray-800 pb-2">Key Sub-Tasks</h3>
              <ul className="space-y-4">
                {result.breakdown.sub_tasks.map((task, index) => (
                  <li 
                    key={index} 
                    className="flex items-start p-3 bg-gray-800 rounded-lg border border-gray-700 shadow-sm hover:border-gray-500 transition-colors"
                  >
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700 text-gray-100 font-bold flex items-center justify-center text-sm mr-3">
                      {index + 1}
                    </span>
                    <p className="flex-1 text-base text-gray-300 pt-1">{task}</p>
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