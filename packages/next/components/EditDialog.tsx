import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (character: {
    id: string;
    name: string;
    description: string;
    greeting: string;
  }) => void;
  character: {
    id: string;
    name: string;
    description: string;
    greeting: string;
  };
}

export function EditDialog({
  isOpen,
  onClose,
  onSave,
  character,
}: EditDialogProps) {
  const [name, setName] = useState(character.name);
  const [description, setDescription] = useState(character.description);
  const [greeting, setGreeting] = useState(character.greeting);

  useEffect(() => {
    setName(character.name);
    setDescription(character.description);
    setGreeting(character.greeting);
  }, [character]);

  const handleSave = () => {
    onSave({ id: character.id, name, description, greeting });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Edit Character</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-gray-700">
              Character Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-gray-300"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border-gray-300"
              rows={10}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="greeting" className="text-gray-700">
              Greeting (optional)
            </Label>
            <Textarea
              id="greeting"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              className="border-gray-300"
              rows={4}
            />
          </div>
        </div>
        <Button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Save Changes
        </Button>
      </DialogContent>
    </Dialog>
  );
}
