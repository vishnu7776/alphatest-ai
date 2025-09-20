
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileWarning, AlertTriangle, Info, Loader2, Trash2 } from 'lucide-react';
import { BackButton } from '@/components/back-button';

const initialSuggestions = [
    {
        "id": "suggestion-1",
        "title": "Missing Country / Regional Information",
        "message": "With Country Details we can accurately map the relevant compliance with it.",
        "priority": "high",
        "prompt": "",
    },
    {
        "id": "suggestion-2",
        "title": "Identified Compliance Gaps- HIPAA",
        "message": "Provide a detailed section on how your system will handle sensitive patient data, including encryption, access controls, and data retention policies.",
        "priority": "medium",
        "prompt": "",
    },
    {
        "id": "suggestion-3",
        "title": "Incomplete Login Screen Details",
        "message": "Add a dedicated section for 'Authentication and Session Management' to cover these details comprehensively.",
        "priority": "low",
        "prompt": "",
    },
    {
        "id": "suggestion-4",
        "title": "Missing Non-Functional Requirements",
        "message": "Add non-functional requirements for performance (e.g., 'the history must load in under 2 seconds') and security (e.g., 'data must be encrypted at rest').",
        "priority": "low",
        "prompt": "",
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSuggestion, setCurrentSuggestion] = useState<Suggestion | null>(null);
    const [promptText, setPromptText] = useState('');

    const handleOpenModal = (suggestion: Suggestion) => {
        setCurrentSuggestion(suggestion);
        setPromptText(suggestion.prompt || '');
        setIsModalOpen(true);
    }
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentSuggestion(null);
        setPromptText('');
    }

    const handleAddPrompt = () => {
        if (!currentSuggestion) return;

        // Update the prompt for the specific suggestion
        setSuggestions(prev => prev.map(s => 
            s.id === currentSuggestion.id ? { ...s, prompt: promptText } : s
        ));
        
        // Add to addedSuggestions list if not already there
        if (!addedSuggestions.includes(currentSuggestion.id)) {
            setAddedSuggestions(prev => [...prev, currentSuggestion.id]);
        }
        
        handleCloseModal();
    };

    const handleRemoveSuggestion = (id: string) => {
        setAddedSuggestions(prev => prev.filter(item => item !== id));
        // Also clear the prompt text for that suggestion
        setSuggestions(prev => prev.map(s => 
            s.id === id ? { ...s, prompt: '' } : s
        ));
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
        <BackButton />
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
                             {suggestion.prompt && addedSuggestions.includes(suggestion.id) && (
                                <p className="text-sm text-primary bg-primary/10 p-2 rounded-md mt-2">
                                    {suggestion.prompt}
                                </p>
                            )}
                        </div>
                        {addedSuggestions.includes(suggestion.id) ? (
                            <div className='flex items-center gap-2'>
                                <span className="text-sm font-medium text-green-500">Added</span>
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveSuggestion(suggestion.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ) : (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleOpenModal(suggestion)}
                                className="bg-green-600/10 text-green-600 border-green-600/20 hover:bg-green-600/20"
                            >
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

        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{currentSuggestion?.title}</DialogTitle>
                    <DialogDescription>
                        Enter your prompt to address this suggestion.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Label htmlFor="prompt" className="sr-only">Prompt</Label>
                    <Textarea 
                        id="prompt"
                        placeholder="Enter your prompt" 
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                        rows={4}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
                    <Button onClick={handleAddPrompt}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
  );
}

    
