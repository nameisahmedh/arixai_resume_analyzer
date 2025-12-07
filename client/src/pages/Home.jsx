// 👈 POINTER: Main resume upload page
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { Upload, FileText, ArrowRight, Loader2, CheckCircle, AlertCircle, Sparkles, BarChart3, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/clerk-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { getToken, isSignedIn } = useAuth();

  // 👈 POINTER: Handle file selection from input
  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError(null);
    }
  };

  // 👈 POINTER: Main form submission - uploads resume for analysis
  const onSubmit = async (data) => {
    setError(null);
    setIsAnalyzing(true);

    try {
      if (!selectedFile) {
        setError('Please select a resume file');
        setIsAnalyzing(false);
        return;
      }

      // 👈 POINTER: Clerk authentication check
      if (!isSignedIn) {
        setError('Please sign in to analyze your resume');
        setIsAnalyzing(false);
        return;
      }

      // 👈 POINTER: Get authentication token from Clerk
      const token = await getToken();

      if (!token) {
        setError('Authentication token not available. Please try signing in again.');
        setIsAnalyzing(false);
        return;
      }

      console.log('Starting resume analysis...');

      // 👈 POINTER: Prepare FormData with resume file and job description
      const formData = new FormData();
      formData.append('resume', selectedFile);
      formData.append('job_description', data.job_description || '');

      // 👈 POINTER: Send to backend API for AI analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      // 👈 POINTER: Get analysis results from API
      const result = await response.json();

      console.log('Analysis completed successfully');
      // 👈 POINTER: Store results in session storage for Results page
      sessionStorage.setItem('analysisResult', JSON.stringify(result));

      setLocation('/results');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const features = [
    {
      icon: <Sparkles className="size-6 text-yellow-500" />,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your resume against industry standards."
    },
    {
      icon: <BarChart3 className="size-6 text-blue-500" />,
      title: "Detailed Scoring",
      description: "Get a comprehensive score and breakdown of your resume's impact."
    },
    {
      icon: <Shield className="size-6 text-green-500" />,
      title: "ATS Compatibility",
      description: "Ensure your resume passes Applicant Tracking Systems with ease."
    },
    {
      icon: <Zap className="size-6 text-purple-500" />,
      title: "Instant Feedback",
      description: "Receive actionable insights to improve your resume in seconds."
    }
  ];

  return (
    <Layout>
      <div className="relative overflow-hidden min-h-screen flex flex-col justify-center items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-[40%] -left-[20%] size-[800px] rounded-full bg-primary/5 blur-3xl opacity-50 animate-pulse" />
          <div className="absolute top-[20%] -right-[20%] size-[600px] rounded-full bg-purple-500/5 blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container relative max-w-screen-xl px-6 py-6 md:px-12 md:py-12 lg:px-16 lg:py-16 flex flex-col justify-center">
          <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:gap-12 items-center">

            {/* Hero Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center justify-center lg:justify-start gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit mx-auto lg:mx-0">
                <Sparkles className="size-3.5" />
                <span>Now with Advanced AI Models</span>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
                ArixAI <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Resume Analyzer</span>
              </h1>

              <p className="max-w-[42rem] leading-relaxed text-muted-foreground sm:text-xl sm:leading-8 mx-auto lg:mx-0">
                Stop guessing. Use our AI to analyze your resume, match it to job descriptions, and get actionable feedback to land your dream job.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start mt-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/80 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/50 shadow-sm">
                  <CheckCircle className="size-4 text-green-500" />
                  <span>ATS Optimized</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/80 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/50 shadow-sm">
                  <CheckCircle className="size-4 text-green-500" />
                  <span>Keyword Matching</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/80 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border/50 shadow-sm">
                  <CheckCircle className="size-4 text-green-500" />
                  <span>Smart Insights</span>
                </div>
              </div>
            </motion.div>

            {/* Upload Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-2xl -z-10 transform rotate-1" />
              <Card className="border-border/50 shadow-2xl bg-background/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Start Your Analysis</CardTitle>
                  <CardDescription>
                    Upload your resume to get started. Supported formats: PDF, DOCX, TXT.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2"
                      >
                        <AlertCircle className="size-5 text-destructive mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-destructive">{error}</p>
                      </motion.div>
                    )}


                    <div className="space-y-2">
                      <Label htmlFor="resume">Resume File</Label>
                      <label
                        htmlFor="resume"
                        className={`
                          group border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all duration-300
                          ${selectedFile ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                        `}
                      >
                        <div className={`
                          p-4 rounded-full transition-colors duration-300
                          ${selectedFile ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'}
                        `}>
                          {selectedFile ? <FileText className="size-8" /> : <Upload className="size-8" />}
                        </div>
                        <div className="space-y-1">
                          {selectedFile ? (
                            <>
                              <p className="text-base font-semibold text-foreground break-all line-clamp-2">{selectedFile.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(selectedFile.size / 1024).toFixed(1)} KB
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-base font-medium">Click to upload or drag and drop</p>
                              <p className="text-sm text-muted-foreground">PDF, DOCX or TXT (Max 5MB)</p>
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
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="job_description">Job Description (Optional)</Label>
                      <Textarea
                        id="job_description"
                        placeholder="Paste the job description here for tailored feedback..."
                        className="min-h-[100px] resize-none bg-background/50 focus:bg-background transition-colors"
                        {...register("job_description")}
                        data-testid="input-job-description"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all cursor-pointer"
                      disabled={isAnalyzing || !selectedFile}
                      data-testid="button-analyze"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 size-5 animate-spin" />
                          Analyzing Resume...
                        </>
                      ) : (
                        <>
                          Analyze Now
                          <ArrowRight className="ml-2 size-5" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Features Section */}
          <div className="mt-32">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Why Use ArixAI Resume Analyzer?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We use cutting-edge technology to give you the competitive edge in your job search.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full border-border/50 bg-background/50 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="mb-4 p-3 rounded-lg bg-background w-fit shadow-sm border border-border/50">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
