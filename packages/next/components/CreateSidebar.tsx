"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon, TrashIcon, ShareIcon } from "lucide-react";
import { CreateDialog } from "./CreateDialog";
import { PublishDialog } from "./PublishDialog";
import { EditDialog } from "./EditDialog";
import { Draft } from "@/lib/types";

export default function Component({
  drafts,
  setDrafts,
  setSelectedDraftId,
  selectedDraftId,
}: {
  drafts: Draft[];
  setDrafts: (drafts: Draft[]) => void;
  setSelectedDraftId: (draftId: string) => void;
  selectedDraftId: string;
}) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);

  const handleDraftClick = (draftId: string) => {
    setSelectedDraftId(draftId);
  };

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateSave = (character: {
    name: string;
    description: string;
    greeting: string;
    image: File | null;
    nftName: string;
    nftSymbol: string;
  }) => {
    const newDraft: Draft = {
      id: Date.now().toString(),
      title: character.name,
      avatar: character.image
        ? URL.createObjectURL(character.image)
        : "/placeholder.svg?height=32&width=32", // Updated to use character.image
      description: character.description,
      nftName: character.nftName,
      nftSymbol: character.nftSymbol,
    };
    setDrafts([...drafts, newDraft]);
  };

  const handlePublishSave = (character: {
    name: string;
    description: string;
    publishType: "free" | "premium";
    subscriptionAmount?: number;
  }) => {
    console.log(character);
  };

  const handleDelete = (id: string) => {
    setDrafts(drafts.filter((draft) => draft.id !== id));
  };

  const handleEdit = (draft: Draft) => {
    setEditingDraft(draft);
    setIsEditDialogOpen(true);
  };

  const handleEditSave = (character: {
    id: string;
    name: string;
    description: string;
    greeting: string;
  }) => {
    setDrafts(
      drafts.map((draft) =>
        draft.id === character.id ? { ...draft, title: character.name } : draft
      )
    );
  };

  return (
    <div className="w-64 bg-black h-full flex flex-col border-r border-gray-800">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-yellow-500 to-yellow-700 bg-clip-text text-transparent">
          Drafts
        </h2>
      </div>
      <div className="p-4">
        <Button
          onClick={handleCreate}
          className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-500 to-yellow-700 text-black hover:opacity-90"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Create</span>
        </Button>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {drafts.map((draft) => (
          <li
            key={draft.id}
            className={`hover:bg-gray-900 transition-colors cursor-pointer ${
              selectedDraftId === draft.id ? "bg-gray-900" : ""
            }`}
            onClick={() => handleDraftClick(draft.id)}
          >
            <div className="flex items-center p-4 space-x-3">
              <Avatar className="border-2 border-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 p-[2px]">
                <AvatarImage
                  src={draft.avatar}
                  alt={draft.title}
                  className="rounded-full bg-black"
                />
                <AvatarFallback className="bg-black text-yellow-500 rounded-full">
                  {draft.title[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-300 truncate">
                  {draft.title}
                </p>
              </div>
              {selectedDraftId === draft.id && (
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-yellow-500 hover:bg-gray-800"
                    onClick={() => handleEdit(draft)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-yellow-500 hover:bg-gray-800"
                    onClick={() => handleDelete(draft.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-yellow-500 hover:bg-gray-800"
                    onClick={() => setIsPublishDialogOpen(true)}
                  >
                    <ShareIcon className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <CreateDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onSave={handleCreateSave}
      />
      <PublishDialog
        isOpen={isPublishDialogOpen}
        onClose={() => setIsPublishDialogOpen(false)}
        onSave={handlePublishSave}
      />
      {editingDraft && (
        <EditDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleEditSave}
          character={{
            id: editingDraft.id,
            name: editingDraft.title,
            description: "",
            greeting: "",
          }}
        />
      )}
    </div>
  );
}
