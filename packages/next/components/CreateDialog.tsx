import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface CreateCharacterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (character: {
    name: string;
    description: string;
    greeting: string;
  }) => void;
}

export function CreateDialog({
  isOpen,
  onClose,
  onSave,
}: CreateCharacterDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [greeting, setGreeting] = useState("");

  const handleSave = () => {
    onSave({ name, description, greeting });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Create Character</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          Create your character to start a conversation.
          {/* Read our beginner-friendly{" "}
          <a href="#" className="text-blue-500 hover:underline">
            character creation guide
          </a>{" "}
          to get started. */}
        </p>
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
              placeholder="Tell the model what character it should be and how it should act. Describe the character's personality, appearance, actions, and more. e.g. Edward is a blue vampire dragon who likes to play guitar."
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
              placeholder="The character will always introduce themselves with this greeting. e.g. Welcome to my lair, mortal."
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
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
