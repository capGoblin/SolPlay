"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";

interface Bot {
  id: number;
  name: string;
  description: string;
  avatar: string;
}

const bots: Bot[] = [
  {
    id: 1,
    name: "Mr Beast",
    description:
      "Mr Beast, is a famous YouTuber known for his elaborate stunts, challenges, and philanthropic acts like planting 20 million trees and donating millions ...",
    avatar: "/placeholder.svg",
  },
  // Add more bots here if needed
];

export default function Component() {
  const [profileName, setProfileName] = useState("odious_decoy_309");
  const [bio, setBio] = useState("agasgasassaFas\nFasF\nASF\nASf\nAS");
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    // Here you would typically save the profile data
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="container mx-auto p-4 max-w-4xl">
          <div className="flex flex-col items-center mb-8">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src="/placeholder.svg" alt={profileName} />
              <AvatarFallback>OD</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold mb-2">{profileName}</h1>
            <p className="text-center text-muted-foreground mb-4 whitespace-pre-line">
              {bio}
            </p>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="default">Edit Profile</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white shadow-lg rounded-lg">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="mx-auto bg-muted rounded-full w-24 h-24 flex items-center justify-center">
                    <span className="text-2xl text-muted-foreground">+</span>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right text-gray-700">
                      Profile Name
                    </Label>
                    <Input
                      id="name"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="col-span-3 text-gray-700"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="bio" className="text-right text-gray-700">
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="col-span-3 text-gray-700"
                      rows={6}
                    />
                  </div>
                </div>
                <Button
                  onClick={handleSave}
                  className="w-full  bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bots.map((bot) => (
              <Card
                key={bot.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar>
                    <AvatarImage src={bot.avatar} alt={bot.name} />
                    <AvatarFallback>{bot.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{bot.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{bot.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
