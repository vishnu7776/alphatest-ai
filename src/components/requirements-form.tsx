'use client';

import { useActionState, useEffect, useState, useRef, Suspense } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { generateTestCasesAction } from '@/app/(main)/requirements/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  Loader2,
  Mic,
  UploadCloud,
  File as FileIcon,
  X,
  Check,
  Ban,
  Info,
  BookOpen,
  AlertTriangle,
  FileWarning
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from './ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

const initialState = {
  summary: undefined,
  testCases: undefined,
  error: undefined,
};

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={disabled || pending} className="w-full">
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

const suggestions = [
    {
        "id": "suggestion-1",
        "title": "Missing Country / Regional Information",
        "message": "With Country Details we can accurately map the relevant compliance with it.",
        "priority": "high",
        "action": "Fetch Automatically",
        "actionVariant": "destructive"
    },
    {
        "id": "suggestion-2",
        "title": "Identified Compliance Gaps- HIPAA",
        "message": "Provide a detailed section on how your system will handle sensitive patient data, including encryption, access controls, and data retention policies.",
        "priority": "medium",
        "action": "Add"
    },
    {
        "id": "suggestion-3",
        "title": "Incomplete Login Screen Details",
        "message": "Add a dedicated section for 'Authentication and Session Management' to cover these details comprehensively.",
        "priority": "low",
        "action": "Add",
        "actionVariant": "outline"

    },
    {
        "id": "suggestion-4",
        "title": "Missing Non-Functional Requirements",
        "message": "Add non-functional requirements for performance (e.g., 'the history must load in under 2 seconds') and security (e.g., 'data must be encrypted at rest').",
        "priority": "low",
        "action": "Add",
        "actionVariant": "outline"
    }
]

const getIconForPriority = (priority: string) => {
    switch (priority) {
        case 'high':
            return <FileWarning className="h-8 w-8 text-destructive mt-1 flex-shrink-0" />;
        case 'medium':
            return <AlertTriangle className="h-8 w-8 text-yellow-500 mt-1 flex-shrink-0" />;
        case 'low':
            return <Info className="h-8 w-8 text-blue-500 mt-1 flex-shrink-0" />;
        default:
            return <Info className="h-8 w-8 text-blue-500 mt-1 flex-shrink-0" />;
    }
}

function RequirementsFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, formAction] = useActionState(
    generateTestCasesAction,
    initialState
  );
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [requirementsText, setRequirementsText] = useState('');
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<any>(null);

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showValidation, setShowValidation] = useState(searchParams.get('step') === 'validate');

  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);


  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.error,
      });
       setIsLoading(false);
       setShowModal(false);
    }
     if (!state.error && (state.summary || state.testCases)) {
      setIsLoading(false);
      setShowModal(true);
    }
  }, [state, toast]);

  useEffect(() => {
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
      
      recognitionRef.current.onend = () => {};

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
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      handleUpload(selectedFile);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      handleUpload(selectedFile);
    }
  };

  const handleUpload = (fileToUpload: File) => {
    setFile(fileToUpload);
    setProgress(0);
    const reader = new FileReader();

    reader.onloadstart = () => {
      setProgress(0);
    }

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentage = Math.round((event.loaded * 100) / event.total);
        setProgress(percentage);
      }
    };
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setRequirementsText(content); // Replace instead of append
      setProgress(100);
    };

    reader.onerror = () => {
      toast({
        variant: 'destructive',
        title: 'File Error',
        description: 'Failed to read the file.',
      });
      setProgress(0);
      setFile(null);
    }

    reader.readAsText(fileToUpload);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setProgress(0);
    setRequirementsText('');
    if(fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleFormAction = (formData: FormData) => {
    setIsLoading(true);
    formAction(formData);
  };

  const [isUpdating, setIsUpdating] = useState(false);

  if (isUpdating) {
    return (
       <div className="flex flex-col items-center justify-center gap-4 h-64">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Updating document and re-analyzing...</p>
      </div>
    )
  }
  
  if (showValidation) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Requirement Document Validation</h1>
          <p className="text-muted-foreground">Please review the findings below and update your document accordingly.</p>
        </div>
        
        <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI Suggestions</h3>
            {suggestions.map((suggestion) => (
                 <Card key={suggestion.id}>
                    <CardContent className="p-4 flex items-start gap-4">
                        {getIconForPriority(suggestion.priority)}
                        <div className="flex-grow">
                            <h4 className="font-semibold">{suggestion.title}</h4>
                            <p className="text-sm text-muted-foreground">{suggestion.message}</p>
                        </div>
                        <Button size="sm" variant={(suggestion.actionVariant as any) || 'default'}>{suggestion.action}</Button>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
            <Button variant="outline" onClick={() => {
                setIsUpdating(true);
                setTimeout(() => {
                    router.push('/test-cases');
                }, 2000);
            }}>
                Update Document & Re-validate
            </Button>
            <Button onClick={() => router.push('/test-cases')}>
                Proceed with warning
            </Button>
        </div>
      </div>
    );
  }

  return (
    <>
     <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Import Requirement
        </h1>
        <p className="text-muted-foreground">
          Upload your software requirements document, type them directly, or use
          your voice. Our AI will analyze it for completeness and compliance.
        </p>
      </div>
    <form ref={formRef} action={handleFormAction} className="space-y-6">
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
                  ref={fileInputRef}
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
                 { progress === 100 && <p className="text-xs text-green-500">File content loaded into requirements text area.</p>}
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

      {state.error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Generation Failed</AlertTitle>
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center">
        <div className="w-full max-w-xs">
          <SubmitButton disabled={!requirementsText} />
        </div>
      </div>
    </form>
    
    <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalize Details</DialogTitle>
            <DialogDescription>
              Provide the final details for your application before generating the test cases.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appName" className="text-right">
                App Name
              </Label>
              <Input
                id="appName"
                defaultValue="My Healthcare App"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="objective" className="text-right">
                Objective
              </Label>
              <Textarea
                id="objective"
                defaultValue="To streamline patient record management and appointment scheduling."
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
             <Button onClick={() => {
                setShowModal(false);
                router.push('/requirements?step=validate');
                setShowValidation(true);
                toast({ title: "Success", description: "Analysis complete. Please review the validation findings."});
              }}>Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function RequirementsForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RequirementsFormContent />
    </Suspense>
  )
}
