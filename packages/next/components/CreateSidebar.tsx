import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon, TrashIcon, ShareIcon } from "lucide-react";
import { CreateDialog } from "./CreateDialog";
import { PublishDialog } from "./PublishDialog";
import { EditDialog } from "./EditDialog";
interface Draft {
  id: string;
  title: string;
  avatar: string;
}

export default function CreateSidebar() {
  const [drafts, setDrafts] = useState<Draft[]>([
    {
      id: "1",
      title: "Mr Beast",
      avatar: "/placeholder.svg?height=32&width=32",
    },
  ]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);

  const handleCreate = () => {
    setIsCreateDialogOpen(true);
  };

  const handleCreateSave = (character: {
    name: string;
    description: string;
    greeting: string;
  }) => {
    const newDraft: Draft = {
      id: Date.now().toString(),
      title: character.name,
      avatar: "/placeholder.svg?height=32&width=32",
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
    <div className="w-64 bg-gray-100 h-full flex flex-col border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Drafts</h2>
      </div>
      <div className="p-4">
        <Button
          onClick={handleCreate}
          className="w-full flex items-center justify-center space-x-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Create</span>
        </Button>
      </div>
      <ul className="flex-1 overflow-y-auto">
        {drafts.map((draft) => (
          <li key={draft.id} className="hover:bg-gray-200 transition-colors">
            <div className="flex items-center p-4 space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={draft.avatar} alt={draft.title} />
                <AvatarFallback>{draft.title[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {draft.title}
                </p>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleEdit(draft)}
                >
                  <PencilIcon className="h-4 w-4 text-gray-500" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDelete(draft.id)}
                >
                  <TrashIcon className="h-4 w-4 text-gray-500" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ShareIcon
                    className="h-4 w-4 text-gray-500"
                    onClick={() => setIsPublishDialogOpen(true)}
                  />
                </Button>
              </div>
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
