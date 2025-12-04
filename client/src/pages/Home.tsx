import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { Upload, FileText, ArrowRight, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import type { AnalysisResult } from "@/lib/mockData";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  const onSubmit = async (data: any) => {
    setError(null);
    setIsAnalyzing(true);

    try {
      if (!selectedFile) {
        setError('Please select a resume file');
        setIsAnalyzing(false);
        return;
      }

      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('job_description', data.job_description || '');

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result: AnalysisResult = await response.json();
      
      sessionStorage.setItem('analysisResult', JSON.stringify(result));
      setLocation('/results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Layout>
      <div className="container relative max-w-screen-xl px-4 py-10 md:px-8 md:py-20 lg:py-32">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-[40%] -left-[20%] size-[800px] rounded-full bg-primary/5 blur-3xl opacity-50" />
          <div className="absolute top-[20%] -right-[20%] size-[600px] rounded-full bg-purple-500/5 blur-3xl opacity-50" />
        </div>

        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4 text-center lg:text-left"
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              Optimize Your Resume with AI
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 mx-auto lg:mx-0">
              Upload your resume and job description to get instant, actionable feedback. Beat the ATS and land more interviews.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start mt-4">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                <CheckCircle className="size-4 text-green-500" />
                <span>ATS Compatibility Check</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                <CheckCircle className="size-4 text-green-500" />
                <span>Skill Gap Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/80">
                <CheckCircle className="size-4 text-green-500" />
                <span>Tailored Feedback</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <Card className="border-border/50 shadow-xl bg-background/60 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Start Analysis</CardTitle>
                <CardDescription>
                  Upload your resume (PDF, DOCX, TXT) and the target job description.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                    <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                      <AlertCircle className="size-5 text-destructive mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-destructive">{error}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="resume">Resume File</Label>
                    <label 
                      htmlFor="resume" 
                      className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer bg-muted/30"
                    >
                      <div className="p-3 rounded-full bg-primary/10 text-primary">
                        {selectedFile ? <FileText className="size-6" /> : <Upload className="size-6" />}
                      </div>
                      <div className="space-y-1">
                        {selectedFile ? (
                          <>
                            <p className="text-sm font-medium text-foreground">{selectedFile.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PDF, DOCX or TXT (Max 5MB)</p>
                          </>
                        )}
                      </div>
                      <input 
                        id="resume" 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.docx,.doc,.txt"
                        onChange={onFileChange}
                        data-testid="input-resume"
                      />
                    </label>
                    {errors.resume && <p className="text-sm text-destructive">Please upload a resume.</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job_description">Job Description (Optional)</Label>
                    <Textarea 
                      id="job_description"
                      placeholder="Paste the job description here for better matching..."
                      className="min-h-[120px] resize-none bg-background/50"
                      {...register("job_description")}
                      data-testid="input-job-description"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full text-base" 
                    disabled={isAnalyzing || !selectedFile}
                    data-testid="button-analyze"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze Resume
                        <ArrowRight className="ml-2 size-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
