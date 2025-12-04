import { Layout } from "@/components/Layout";
import type { AnalysisResult } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, AlertCircle, Briefcase, BookOpen, User, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip } from "recharts";

export default function Results() {
  const [, setLocation] = useLocation();
  const [result, setResult] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('analysisResult');
    if (stored) {
      try {
        setResult(JSON.parse(stored));
      } catch {
        setLocation('/');
      }
    } else {
      setLocation('/');
    }
  }, [setLocation]);

  if (!result) {
    return null;
  }

  const radarData = [
    { category: 'Summary', score: result.section_scores?.summary || 0 },
    { category: 'Experience', score: result.section_scores?.experience || 0 },
    { category: 'Skills', score: result.section_scores?.skills || 0 },
    { category: 'Projects', score: result.section_scores?.projects || 0 },
  ];

  return (
    <Layout>
      <div className="container max-w-screen-xl px-4 py-8 md:px-8">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="pl-0 hover:pl-2 transition-all text-muted-foreground" data-testid="button-back">
              <ArrowLeft className="mr-2 size-4" />
              Analyze another resume
            </Button>
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight">Analysis Results</h1>
          <p className="text-muted-foreground">Here is how your resume stacks up against the job description.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="overflow-hidden border-primary/20 shadow-lg">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-purple-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium text-muted-foreground">Overall Match</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-6">
                  <div className="relative flex items-center justify-center size-40">
                     <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          className="text-muted/30 stroke-current"
                          strokeWidth="8"
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                        ></circle>
                        <circle
                          className="text-primary stroke-current"
                          strokeWidth="8"
                          strokeLinecap="round"
                          cx="50"
                          cy="50"
                          r="40"
                          fill="transparent"
                          strokeDasharray={`${result.overall_score * 2.51} 251.2`}
                        ></circle>
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold tracking-tighter" data-testid="text-overall-score">{result.overall_score}</span>
                        <span className="text-sm text-muted-foreground font-medium">/ 100</span>
                     </div>
                  </div>
                  <div className="mt-6 w-full space-y-2">
                    <div className="flex justify-between text-sm font-medium">
                      <span>Skill Match</span>
                      <span data-testid="text-skill-match">{result.skill_match_score}%</span>
                    </div>
                    <Progress value={result.skill_match_score} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle2 className="size-5 text-green-500" />
                    Matched Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.matched_skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="px-2 py-1 text-xs font-medium bg-green-500/10 text-green-700 hover:bg-green-500/20 border-transparent" data-testid={`badge-matched-${idx}`}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertCircle className="size-5 text-red-500" />
                    Missing Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.missing_skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="px-2 py-1 text-xs font-medium border-red-200 text-red-700 bg-red-50" data-testid={`badge-missing-${idx}`}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {result.section_scores && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Section Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis 
                          dataKey="category" 
                          tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                        />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                        <Radar 
                          dataKey="score" 
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.3} 
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="md:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card className="bg-primary/5 border-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/80 leading-relaxed" data-testid="text-feedback-summary">
                    {result.feedback_summary}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <h3 className="text-lg font-semibold mt-8 mb-4">Detailed Analysis</h3>
            
            <div className="grid gap-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <User className="size-4 text-blue-500" />
                      Professional Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{result.section_feedback.summary}</p>
                    <Separator className="my-4" />
                    <div className="rounded-md bg-muted p-4">
                      <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Suggested Improvement</p>
                      <p className="text-sm italic text-foreground/90" data-testid="text-improved-summary">"{result.improved_summary_example}"</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Briefcase className="size-4 text-purple-500" />
                      Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{result.section_feedback.experience}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Cpu className="size-4 text-orange-500" />
                      Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{result.section_feedback.skills}</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BookOpen className="size-4 text-pink-500" />
                      Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{result.section_feedback.projects}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
