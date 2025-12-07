// 👈 POINTER: Results page - displays AI analysis output
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { ArrowRight, Download } from "lucide-react";

export default function Results() {
  const [, setLocation] = useLocation();
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // 👈 POINTER: Load analysis results from session storage
  useEffect(() => {
    const result = sessionStorage.getItem('analysisResult');
    if (result) {
      setAnalysisResult(JSON.parse(result));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <p>Loading results...</p>
        </div>
      </Layout>
    );
  }

  if (!analysisResult) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">No Analysis Results</h1>
            <Button onClick={() => setLocation("/")}>Go Back Home</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-12 px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Resume Analysis</h1>
          <p className="text-muted-foreground">Detailed insights and recommendations to improve your resume</p>
        </div>

        {/* Overall Score */}
        <Card className="mb-6 border-border/50 bg-gradient-to-r from-primary/10 to-purple-500/10">
          <CardHeader>
            <CardTitle>Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold text-primary">{analysisResult.overallScore || 0}/100</div>
          </CardContent>
        </Card>

        {/* Strengths */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle>Strengths</CardTitle>
            <CardDescription>What you're doing well</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {analysisResult.strengths?.map((strength, index) => (
                <li key={index} className="text-foreground">{strength}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Improvements */}
        <Card className="mb-6 border-border/50">
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
            <CardDescription>What can be better</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {analysisResult.improvements?.map((improvement, index) => (
                <li key={index} className="text-foreground">{improvement}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Keyword Match */}
        {analysisResult.keywordMatch && (
          <Card className="mb-6 border-border/50">
            <CardHeader>
              <CardTitle>Keyword Match Analysis</CardTitle>
              <CardDescription>Job Description Alignment: {analysisResult.keywordMatch.score || 0}%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Matched Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywordMatch.matched?.map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-green-500/10 text-green-700 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.keywordMatch.missing?.map((keyword, index) => (
                      <span key={index} className="px-3 py-1 bg-red-500/10 text-red-700 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sections */}
        {analysisResult.sections && (
          <Card className="mb-6 border-border/50">
            <CardHeader>
              <CardTitle>Section Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResult.sections.map((section, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{section.name}</h4>
                      <span className="text-lg font-bold text-primary">{section.score}/100</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{section.feedback}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {analysisResult.recommendations && (
          <Card className="mb-6 border-border/50">
            <CardHeader>
              <CardTitle>Top Recommendations</CardTitle>
              <CardDescription>Prioritized actions to improve your resume</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2">
                {analysisResult.recommendations.map((rec, index) => (
                  <li key={index} className="text-foreground">{rec}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-8">
          <Button onClick={() => setLocation("/")} variant="outline">
            Analyze Another Resume
          </Button>
          <Button onClick={() => window.print()}>
            <Download className="mr-2 size-4" />
            Download Results
          </Button>
        </div>
      </div>
    </Layout>
  );
}
