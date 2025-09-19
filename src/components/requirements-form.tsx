'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { useEffect } from 'react';
import { generateTestCasesAction } from '@/app/(main)/requirements/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, Bot, Clipboard, Loader2, FileText, Check } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from './ui/skeleton';

const initialState = {
  summary: '',
  testCases: '',
  error: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        'Generate Test Cases'
      )}
    </Button>
  );
}

function ResultSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
       <div className="space-y-2">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

export function RequirementsForm() {
  const [state, formAction] = useFormState(
    generateTestCasesAction,
    initialState
  );
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
  
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Test cases have been copied successfully.",
      action: <Check className="h-5 w-5 text-green-500" />
    })
  }

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Requirements Document</CardTitle>
          <CardDescription>
            Paste the full text of your software requirements document below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-2">
            <Textarea
              name="requirements"
              placeholder="e.g., The system shall allow users to register with an email and password..."
              rows={15}
              required
              minLength={50}
            />
            <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
              <SubmitButton />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Generated Assets</CardTitle>
          <CardDescription>
            AI-generated summary and test cases will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pending ? (
            <ResultSkeleton />
          ) : state.summary || state.testCases ? (
            <ScrollArea className="h-[380px] pr-4">
              <div className="space-y-6">
                {state.summary && (
                  <div>
                    <h3 className="flex items-center font-semibold mb-2">
                      <Bot className="mr-2 h-5 w-5 text-primary" />
                      Summary
                    </h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {state.summary}
                    </p>
                  </div>
                )}
                {state.testCases && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="flex items-center font-semibold">
                        <FileText className="mr-2 h-5 w-5 text-primary" />
                        Test Cases
                      </h3>
                      <Button variant="ghost" size="icon" onClick={() => handleCopyToClipboard(state.testCases!)}>
                        <Clipboard className="h-4 w-4" />
                        <span className="sr-only">Copy Test Cases</span>
                      </Button>
                    </div>
                    <div className="prose prose-sm dark:prose-invert max-w-none bg-muted/50 p-4 rounded-md whitespace-pre-wrap">
                      <code>{state.testCases}</code>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex items-center justify-center h-[380px] text-center">
              <div className='flex flex-col items-center gap-2 text-muted-foreground'>
                <Bot size={48} />
                <p>Results will be shown here once generated.</p>
              </div>
            </div>
          )}

          {state.error && !pending && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Generation Failed</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </form>
  );
}
