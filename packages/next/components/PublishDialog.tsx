import React, { useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PublishDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (character: {
    name: string;
    description: string;
    publishType: "free" | "premium";
    subscriptionAmount?: number;
  }) => void;
}

export function PublishDialog({ isOpen, onClose, onSave }: PublishDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [publishType, setPublishType] = useState<"free" | "premium">("free");
  const [subscriptionAmount, setSubscriptionAmount] = useState<
    number | undefined
  >();

  const handleSave = () => {
    onSave({ name, description, publishType, subscriptionAmount });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle>Publish character</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500 mb-4">
          Publish this character to your profile. The model and prompt will
          always be private.
        </p>
        <div className="mb-4">
          <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
            <span className="text-3xl text-gray-400">+</span>
          </div>
        </div>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-gray-700">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-gray-300"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description" className="text-gray-700">
              Public Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border-gray-300"
            />
          </div>
          <div className="grid gap-2">
            <Label className="text-gray-700">Publish Type</Label>
            <RadioGroup
              value={publishType}
              onValueChange={(value: "free" | "premium") =>
                setPublishType(value)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free">Free</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="premium" id="premium" />
                <Label htmlFor="premium">Premium</Label>
              </div>
            </RadioGroup>
          </div>
          {publishType === "premium" && (
            <div className="grid gap-2">
              <Label htmlFor="subscriptionAmount" className="text-gray-700">
                Monthly Subscription Amount ($)
              </Label>
              <Input
                id="subscriptionAmount"
                type="number"
                value={subscriptionAmount || ""}
                onChange={(e) => setSubscriptionAmount(Number(e.target.value))}
                className="w-full border-gray-300 "
              />
            </div>
          )}
        </div>
        <Button onClick={handleSave} className="w-full bg-gray-700 text-white">
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
