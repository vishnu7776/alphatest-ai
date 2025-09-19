'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { generateTestCasesAction } from '@/app/(main)/requirements/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  AlertCircle,
  Loader2,
  Mic,
  UploadCloud,
  File as FileIcon,
  X,
  Check,
  Ban,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from './ui/progress';

const initialState = {
  summary: '',
  testCases: '',
  error: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Analyze & Continue'
      )}
    </Button>
  );
}

export function RequirementsForm() {
  const [state, formAction] = useActionState(
    generateTestCasesAction,
    initialState
  );
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [requirementsText, setRequirementsText] = useState('');
  
  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const { pending } = useFormStatus();
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
    }
  }, [state.error, toast]);

  useEffect(() => {
    // Check for browser support for Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setTranscript(finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast({
          variant: 'destructive',
          title: 'Speech Error',
          description: `An error occurred during speech recognition: ${event.error}`,
        });
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        // The onend event can fire unexpectedly, so we only update state if it was a user-initiated stop.
        // We will manage isListening state in start/stop functions directly.
      };

    } else {
        console.warn("Speech recognition not supported in this browser.");
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);
  

  const startListening = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setIsListening(true);
      recognitionRef.current.start();
    } else {
       toast({
        variant: 'destructive',
        title: 'Not Supported',
        description: 'Speech recognition is not supported in your browser.',
      });
    }
  };

  const stopListening = (append: boolean) => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      if (append && transcript) {
        setRequirementsText(prev => (prev ? prev + ' ' : '') + transcript.trim());
      }
      setTranscript('');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = (file: File) => {
    setProgress(0);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
       setRequirementsText(prev => (prev ? prev + '\n' : '') + content);
    };

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          reader.readAsText(file); // Read file when progress is almost done
          setProgress(100);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
  };
  
  // NOTE: This is a placeholder for the results page.
  if (state.summary || state.testCases) {
    return (
       <Card>
        <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2">Generated Assets</h3>
            <div className="space-y-4">
              {state.summary && (
                <div>
                  <h4 className="font-semibold">Summary</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{state.summary}</p>
                </div>
              )}
               {state.testCases && (
                <div>
                  <h4 className="font-semibold">Test Cases</h4>
                  <pre className="text-sm bg-muted/50 p-4 rounded-md whitespace-pre-wrap"><code>{state.testCases}</code></pre>
                </div>
              )}
            </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card
            className="h-full"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <CardContent className="p-6 h-full">
              <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center">
                <UploadCloud className="h-12 w-12 text-primary" />
                <p className="mt-4 text-lg font-semibold">
                  Drag 'n' drop requirement files here, or click to select
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  TXT, PDF, DOC, DOCX
                </p>
                <input
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileChange}
                  accept=".txt,.pdf,.doc,.docx"
                />
                <Button
                  type="button"
                  variant="link"
                  className="mt-2"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Browse files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-6">
              <label htmlFor="requirements-text" className="text-sm font-medium">
                Type your requirements
              </label>
              <Textarea
                id="requirements-text"
                name="requirements"
                placeholder="e.g., The system must allow users to log in with their email and password."
                className="mt-2"
                rows={5}
                value={requirementsText}
                onChange={(e) => setRequirementsText(e.target.value)}
              />
            </CardContent>
          </Card>
          <Card className="flex flex-col items-center justify-center p-6">
            {isListening ? (
              <div className="flex flex-col items-center gap-4">
                 <p className="text-sm text-primary animate-pulse">Listening...</p>
                 <p className="text-sm text-muted-foreground min-h-[40px] text-center">{transcript || '...'}</p>
                 <div className="flex gap-4">
                    <Button type="button" variant="outline" size="icon" onClick={() => stopListening(false)}>
                      <Ban className="h-5 w-5" />
                      <span className="sr-only">Cancel</span>
                    </Button>
                    <Button type="button" size="icon" onClick={() => stopListening(true)}>
                      <Check className="h-5 w-5" />
                       <span className="sr-only">Okay</span>
                    </Button>
                 </div>
              </div>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-20 w-20 rounded-full bg-primary/10 hover:bg-primary/20"
                  onClick={startListening}
                >
                  <Mic className="h-10 w-10 text-primary" />
                </Button>
                <p className="mt-4 text-sm font-medium">Use your voice</p>
              </>
            )}
          </Card>
        </div>
      </div>

      {file && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <FileIcon className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{progress}%</p>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={progress} className="w-full h-2" />
                </div>
                 { progress === 100 && <p className="text-xs text-green-500">File content added to requirements.</p>}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {state.error && !pending && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Generation Failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center">
        <div className="w-full max-w-xs">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
