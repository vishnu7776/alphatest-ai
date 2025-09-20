
'use client';

import { useState } from "react";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, FileText } from "lucide-react";
import { Separator } from "./ui/separator";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

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

export function ScenarioDetailsSheet({ isOpen, onClose, requirement }: ScenarioDetailsSheetProps) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('sub-tasks');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    
    const groupedTasks = requirement.subTasks.reduce((acc, task) => {
        (acc[task.category] = acc[task.category] || []).push(task);
        return acc;
    }, {} as Record<string, SubTask[]>);

    return (
        <>
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="w-full sm:max-w-[600px] p-0 flex flex-col">
                    <SheetHeader className="p-6">
                        <div className="space-y-2 text-left pt-4">
                            <div className="flex items-center gap-2">
                               <p className="font-semibold text-primary text-sm">{requirement.id}</p>
                               <Badge variant="outline">{requirement.type}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <SheetTitle asChild>
                                  <h2 className="text-2xl font-bold text-foreground">{requirement.title}</h2>
                                </SheetTitle>
                                <Button variant="ghost" size="icon">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </div>
                            <SheetDescription>{requirement.description}</SheetDescription>
                        </div>
                    </SheetHeader>

                    <div className="px-6 space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Project Name</span>
                            <span className="font-semibold text-foreground">{requirement.projectName}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Requirement Source</span>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-foreground">{requirement.source}</span>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">WBS Deliverables</span>
                            <span className="font-semibold text-foreground max-w-[60%] truncate">{requirement.deliverables}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Status</span>
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{requirement.status}</Badge>
                        </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="px-6 flex-1 overflow-y-auto pb-6">
                         <div className="flex items-center gap-4 mb-6">
                            <Button 
                                variant={activeTab === 'workflow' ? 'default' : 'ghost'} 
                                size="sm" 
                                className={activeTab !== 'workflow' ? 'text-muted-foreground' : ''}
                                onClick={() => setActiveTab('workflow')}
                            >
                                Work flow
                            </Button>
                            <Button 
                                variant={activeTab === 'attachments' ? 'default' : 'ghost'} 
                                size="sm" 
                                className={activeTab !== 'attachments' ? 'text-muted-foreground' : ''}
                                onClick={() => setActiveTab('attachments')}
                            >
                                Attachments
                            </Button>
                            <Button 
                                variant={activeTab === 'sub-tasks' ? 'default' : 'ghost'} 
                                size="sm" 
                                className={activeTab !== 'sub-tasks' ? 'text-muted-foreground' : ''}
                                onClick={() => setActiveTab('sub-tasks')}
                            >
                                Sub Tasks
                            </Button>
                        </div>
                        
                        {activeTab === 'workflow' && (
                            <div className="flex justify-center">
                                <Image 
                                    src="/sampleFlowChart.png?v=2" 
                                    alt="Workflow Chart" 
                                    width={500} 
                                    height={700}
                                    className="object-contain"
                                />
                            </div>
                        )}
                        
                        {activeTab === 'attachments' && (
                           <div className="space-y-4">
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
                        )}

                        {activeTab === 'sub-tasks' && (
                            <div className="space-y-6">
                                {Object.entries(groupedTasks).map(([category, tasks]) => (
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
                                ))}
                                 {Object.keys(groupedTasks).length === 0 && (
                                    <div className="text-center text-muted-foreground">
                                        <p>No sub-tasks for this requirement.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
            
            <Dialog open={!!previewImage} onOpenChange={(isOpen) => !isOpen && setPreviewImage(null)}>
                <DialogContent className="max-w-3xl">
                     <DialogTitle>
                        <VisuallyHidden>Image Preview</VisuallyHidden>
                    </DialogTitle>
                    {previewImage && <Image src={previewImage} alt="Preview" width={1200} height={800} className="object-contain rounded-md" />}
                </DialogContent>
            </Dialog>
        </>
    )
}

    
