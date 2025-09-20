
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileWarning, AlertTriangle, Info, Loader2, Trash2 } from 'lucide-react';

const initialSuggestions = [
    {
        "id": "suggestion-1",
        "title": "Missing Country / Regional Information",
        "message": "With Country Details we can accurately map the relevant compliance with it.",
        "priority": "high",
    },
    {
        "id": "suggestion-2",
        "title": "Identified Compliance Gaps- HIPAA",
        "message": "Provide a detailed section on how your system will handle sensitive patient data, including encryption, access controls, and data retention policies.",
        "priority": "medium",
    },
    {
        "id": "suggestion-3",
        "title": "Incomplete Login Screen Details",
        "message": "Add a dedicated section for 'Authentication and Session Management' to cover these details comprehensively.",
        "priority": "low",

    },
    {
        "id": "suggestion-4",
        "title": "Missing Non-Functional Requirements",
        "message": "Add non-functional requirements for performance (e.g., 'the history must load in under 2 seconds') and security (e.g., 'data must be encrypted at rest').",
        "priority": "low",
    }
];

type Suggestion = typeof initialSuggestions[0];

const getIconForPriority = (priority: string) => {
    switch (priority) {
        case 'high':
            return <FileWarning className="h-8 w-8 text-destructive mt-1 flex-shrink-0" />;
        case 'medium':
            return <AlertTriangle className="h-8 w-8 text-yellow-500 mt-1 flex-shrink-0" />;
        case 'low':
            return <Info className="h-8 w-8 text-blue-500 mt-1 flex-shrink-0" />;
        default:
            return <Info className="h-8 w-8 text-blue-500 mt-1 flex-shrink.0" />;
    }
};


export default function RequirementValidationPage() {
    const router = useRouter();
    const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
    const [addedSuggestions, setAddedSuggestions] = useState<string[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleAddSuggestion = (id: string) => {
        setAddedSuggestions(prev => [...prev, id]);
    };

    const handleRemoveSuggestion = (id: string) => {
        setAddedSuggestions(prev => prev.filter(item => item !== id));
    };
    
    const handleUpdateAndRevalidate = () => {
        setIsUpdating(true);
        setTimeout(() => {
            // Remove the suggestions that were "Added" from the main list
            setSuggestions(prev => prev.filter(s => !addedSuggestions.includes(s.id)));
            // Clear the "added" list
            setAddedSuggestions([]);
            setIsUpdating(false);
        }, 2000);
    };

    const handleProceed = () => {
        setIsGenerating(true);
        setTimeout(() => {
            router.push('/requirements/list');
            setIsGenerating(false);
        }, 1000);
    }

  return (
    <div className="pb-24 space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Requirement Document Validation</h1>
            <p className="text-muted-foreground">
            Our AI has analyzed your document and found some areas for improvement. Review the suggestions below.
            </p>
        </div>
        
        {suggestions.length > 0 ? (
            <div className="space-y-4">
                {suggestions.map((suggestion) => (
                <Card key={suggestion.id}>
                    <CardContent className="p-4 flex items-start gap-4">
                    {getIconForPriority(suggestion.priority)}
                    <div className="flex-grow">
                        <p className="font-semibold text-foreground">{suggestion.title}</p>
                        <p className="text-sm text-muted-foreground">{suggestion.message}</p>
                    </div>
                    {addedSuggestions.includes(suggestion.id) ? (
                        <div className='flex items-center gap-2'>
                            <span className="text-sm font-medium text-green-500">Added</span>
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveSuggestion(suggestion.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <Button variant="outline" size="sm" onClick={() => handleAddSuggestion(suggestion.id)}>
                            Add
                        </Button>
                    )}
                    </CardContent>
                </Card>
                ))}
          </div>
        ) : (
            <Card>
                <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground">No pending suggestions. You're ready to proceed!</p>
                </CardContent>
            </Card>
        )}


        <div className="fixed bottom-0 left-0 right-0 lg:left-[--sidebar-width] p-4 bg-background/80 backdrop-blur-sm border-t border-border z-10">
            <div className="flex justify-end gap-4 max-w-6xl mx-auto">
                <Button variant="outline" onClick={handleUpdateAndRevalidate} disabled={isUpdating || addedSuggestions.length === 0}>
                    {isUpdating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                        </>
                    ) : (
                        'Update Document & Re-validate'
                    )}
                </Button>
                <Button onClick={handleProceed} disabled={isGenerating}>
                     {isGenerating ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Proceeding...
                        </>
                    ) : (
                        suggestions.length > 0 ? 'Proceed with warning' : 'Proceed'
                    )}
                </Button>
            </div>
        </div>
    </div>
  );
}
