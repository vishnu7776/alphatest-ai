
'use client';

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, UploadCloud, Trash2, Pencil, Loader2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { cn } from "@/lib/utils";

export type SubTask = {
    category: string;
    task: string;
    completed: boolean;
};

export type Requirement = {
    id: string;
    title: string;
    description: string;
    version: string;
    type: string;
    deliverables: string;
    source: string;
    testCases: number;
    projectName: string;
    status: string;
    subTasks: SubTask[];
};

interface ScenarioDetailsSheetProps {
    isOpen: boolean;
    onClose: () => void;
    requirement: Requirement;
}

type ActiveTab = 'workflow' | 'attachments' | 'sub-tasks';

const alternativeSubTasks: SubTask[] = [
    { category: 'UI/UX Enhancement', task: 'Redesign form for better mobile responsiveness', completed: false },
    { category: 'UI/UX Enhancement', task: 'Add progress bar for multi-step registration', completed: false },
    { category: 'Backend Refactoring', task: 'Migrate patient data to a new schema version', completed: false },
    { category: 'Backend Refactoring', task: 'Optimize API endpoint for faster patient creation', completed: false },
    { category: 'Advanced Security', task: 'Implement two-factor authentication (2FA) for patient accounts', completed: false },
    { category: 'Advanced Security', task: 'Add detailed audit logging for data access', completed: false },
];


const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}


export function ScenarioDetailsSheet({ isOpen, onClose, requirement }: ScenarioDetailsSheetProps) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('sub-tasks');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [attachments, setAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [editPrompt, setEditPrompt] = useState('');
    const [currentRequirement, setCurrentRequirement] = useState(requirement);
    
    const [isEditing, setIsEditing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);


    useEffect(() => {
        setCurrentRequirement(requirement);
    }, [requirement]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setAttachments(prev => [...prev, ...Array.from(event.target.files!)]);
        }
    };

    const handleRemoveAttachment = (index: number) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
    }
    
    const handleUpdateSubtasks = () => {
        setIsUpdating(true);
        console.log('Updating with prompt:', editPrompt);
        // Simulate backend update by toggling subtasks
        setTimeout(() => {
            setCurrentRequirement(prev => ({
                ...prev,
                subTasks: prev.subTasks.length === requirement.subTasks.length ? alternativeSubTasks : requirement.subTasks
            }));
            setIsUpdating(false);
            setIsEditing(false);
            setEditPrompt('');
        }, 2000);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditPrompt('');
    }

    const groupedTasks = currentRequirement.subTasks.reduce((acc, task) => {
        (acc[task.category] = acc[task.category] || []).push(task);
        return acc;
    }, {} as Record<string, SubTask[]>);


    return (
        <>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="w-full sm:max-w-[600px] p-0 flex flex-col">
                    <SheetHeader className="p-6 pb-2">
                         <VisuallyHidden>
                           <SheetTitle>{currentRequirement.title}</SheetTitle>
                           <SheetDescription>{currentRequirement.description}</SheetDescription>
                         </VisuallyHidden>
                        <div className="space-y-2 text-left pt-4">
                            <div className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                    <p className="font-semibold text-primary text-sm">{currentRequirement.id}</p>
                                    <Badge variant="outline">{currentRequirement.type}</Badge>
                               </div>
                               <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
                                   <Pencil className="w-4 h-4" />
                               </Button>
                            </div>
                            <div className="flex items-center justify-between">
                                <h2 className="text-2xl font-bold text-foreground">{currentRequirement.title}</h2>
                            </div>
                            <p className="text-muted-foreground">{currentRequirement.description}</p>
                        </div>
                    </SheetHeader>

                    <div className="px-6 space-y-4 text-sm mt-4">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Project Name</span>
                            <span className="font-semibold text-foreground">{currentRequirement.projectName}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Requirement Source</span>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{currentRequirement.source}</span>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">WBS Deliverables</span>
                            <span className="font-semibold text-foreground max-w-[60%] truncate">{currentRequirement.deliverables}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{currentRequirement.status}</Badge>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="px-6 flex-1 overflow-y-auto pb-24">
                         <div className="flex items-center gap-4 mb-6">
                            <Button 
                                variant={activeTab === 'workflow' ? 'default' : 'ghost'} 
                                size="sm" 
                                className={cn('text-muted-foreground', activeTab === 'workflow' && 'text-primary-foreground')}
                                onClick={() => setActiveTab('workflow')}
                            >
                                Work flow
                            </Button>
                            <Button 
                                variant={activeTab === 'attachments' ? 'default' : 'ghost'} 
                                size="sm" 
                                className={cn('text-muted-foreground', activeTab === 'attachments' && 'text-primary-foreground')}
                                onClick={() => setActiveTab('attachments')}
                            >
                                Attachments
                            </Button>
                            <Button 
                                variant={activeTab === 'sub-tasks' ? 'default' : 'ghost'} 
                                size="sm" 
                                className={cn('text-muted-foreground', activeTab === 'sub-tasks' && 'text-primary-foreground')}
                                onClick={() => setActiveTab('sub-tasks')}
                            >
                                Sub Tasks
                            </Button>
                        </div>
                        
                        {activeTab === 'workflow' && (
                            <div className="flex justify-center">
                                <Image 
                                    src="/sampleFlowChart.png?v=3" 
                                    alt="Workflow Chart" 
                                    width={500} 
                                    height={700}
                                    className="object-contain"
                                />
                            </div>
                        )}
                        
                        {activeTab === 'attachments' && (
                           <div className="space-y-4">
                                <Card 
                                    className="border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <UploadCloud className="h-8 w-8 text-primary" />
                                            <p className="mt-2 text-sm font-semibold">
                                                Click to upload or drag and drop
                                            </p>
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                PDF, DOC, PNG, JPG
                                            </p>
                                        </div>
                                    </CardContent>
                                    <Input 
                                        ref={fileInputRef}
                                        type="file" 
                                        className="hidden" 
                                        multiple 
                                        onChange={handleFileChange}
                                    />
                                </Card>

                                {attachments.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-foreground">Uploaded Files</h4>
                                        {attachments.map((file, index) => (
                                            <Card key={index}>
                                                <CardContent className="p-3 flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        {file.type.startsWith('image/') ? (
                                                            <Image 
                                                                src={URL.createObjectURL(file)} 
                                                                alt={file.name} 
                                                                width={40} 
                                                                height={40}
                                                                className="object-cover rounded-md"
                                                                onLoad={() => URL.revokeObjectURL(URL.createObjectURL(file))}
                                                            />
                                                        ) : (
                                                            <FileText className="w-8 h-8 text-muted-foreground" />
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-medium text-foreground">{file.name}</p>
                                                            <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveAttachment(index)}>
                                                        <Trash2 className="w-4 h-4 text-destructive" />
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="hidden">
                                    <a href="/pdf/Patient Management_System_ User Stories.pdf" target="_blank" rel="noopener noreferrer">
                                        <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                                            <CardContent className="p-4 flex items-center gap-4">
                                                <div className="p-3 bg-muted rounded-md flex-shrink-0">
                                                    <div className="w-6 h-6 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-sm">DOC</div>
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground">Healthyme BRD v1.2</p>
                                                    <p className="text-xs text-muted-foreground">pg 2 of 10</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </a>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Card className="overflow-hidden cursor-pointer" onClick={() => setPreviewImage('/refImage1.png')}>
                                            <CardContent className="p-0">
                                                <Image 
                                                    src="/refImage1.png"
                                                    alt="Reference Image 1"
                                                    width={300}
                                                    height={200}
                                                    className="object-cover w-full h-auto"
                                                />
                                                <div className="p-3">
                                                    <p className="text-sm font-medium">Ref image v.1</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        <Card className="overflow-hidden cursor-pointer" onClick={() => setPreviewImage('/refImage2.png')}>
                                            <CardContent className="p-0">
                                                <Image 
                                                    src="/refImage2.png"
                                                    alt="Reference Image 2"
                                                    width={300}
                                                    height={200}
                                                    className="object-cover w-full h-auto"
                                                />
                                                <div className="p-3">
                                                    <p className="text-sm font-medium">Ref image v.1.2</p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'sub-tasks' && (
                            <div className="space-y-6">
                                {Object.keys(groupedTasks).length > 0 ? (
                                    Object.entries(groupedTasks).map(([category, tasks]) => (
                                        <div key={category}>
                                            <h4 className="font-semibold text-foreground mb-3">{category}</h4>
                                            <div className="space-y-3">
                                                {tasks.map((subtask, index) => (
                                                    <div key={index} className="flex items-start gap-3">
                                                        <Checkbox id={`${category}-${index}`} checked={subtask.completed} className="mt-1" />
                                                        <label htmlFor={`${category}-${index}`} className="text-sm text-muted-foreground">{subtask.task}</label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                     <div className="text-center text-muted-foreground py-8">
                                        <p>No sub-tasks for this requirement.</p>
                                    </div>
                                )}
                                 {isEditing && (
                                    <div className="space-y-4 pt-4">
                                         <h4 className="font-semibold text-foreground">Update with Prompt</h4>
                                        <Textarea
                                            placeholder="e.g., Add two-factor authentication and enhance mobile responsiveness..."
                                            value={editPrompt}
                                            onChange={(e) => setEditPrompt(e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    
                    {isEditing && (
                        <SheetFooter className="fixed bottom-0 right-0 w-full sm:max-w-[600px] bg-background border-t p-4">
                            <Button variant="outline" onClick={handleCancelEdit} disabled={isUpdating}>Cancel</Button>
                            <Button onClick={handleUpdateSubtasks} disabled={isUpdating}>
                                {isUpdating ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save'
                                )}
                            </Button>
                        </SheetFooter>
                    )}
                </SheetContent>
            </Sheet>

            <Dialog open={!!previewImage} onOpenChange={(isOpen) => !isOpen && setPreviewImage(null)}>
                <DialogContent className="max-w-3xl">
                     <DialogHeader>
                        <DialogTitle>
                            <VisuallyHidden>Image Preview</VisuallyHidden>
                        </DialogTitle>
                     </DialogHeader>
                    {previewImage && <Image src={previewImage} alt="Preview" width={1200} height={800} className="object-contain rounded-md" />}
                </DialogContent>
            </Dialog>
        </>
    )
}

    