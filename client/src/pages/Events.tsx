import { AppLayout } from "@/components/layout/AppLayout";
import { useEvents, useCreateEvent } from "@/hooks/use-events";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEventSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, DollarSign, Plus } from "lucide-react";
import { z } from "zod";

const formSchema = insertEventSchema.extend({
  startDate: z.string(),
  entryFee: z.coerce.number(),
  maxEntries: z.coerce.number(),
});

type FormData = z.infer<typeof formSchema>;

export default function Events() {
  const { data: events, isLoading } = useEvents();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const createEvent = useCreateEvent();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: "upcoming",
    },
  });

  const onSubmit = (data: FormData) => {
    createEvent.mutate(data as any, {
      onSuccess: () => {
        setIsCreateOpen(false);
        form.reset();
        toast({ title: "Success", description: "Event created successfully" });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to create event", variant: "destructive" });
      },
    });
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Events</h1>
          <p className="text-muted-foreground">Manage and enter upcoming shows and trials.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
              <Plus className="w-4 h-4" /> Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>Create New Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" {...form.register("title")} className="bg-background/50 border-white/10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL)</Label>
                <Input id="slug" {...form.register("slug")} className="bg-background/50 border-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="date">Start Date</Label>
                    <Input type="date" id="date" {...form.register("startDate")} className="bg-background/50 border-white/10" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" {...form.register("location")} className="bg-background/50 border-white/10" />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="fee">Entry Fee (cents)</Label>
                    <Input type="number" id="fee" {...form.register("entryFee")} className="bg-background/50 border-white/10" />
                 </div>
                 <div className="space-y-2">
                    <Label htmlFor="max">Max Entries</Label>
                    <Input type="number" id="max" {...form.register("maxEntries")} className="bg-background/50 border-white/10" />
                 </div>
              </div>
              <div className="space-y-2">
                 <Label htmlFor="desc">Description</Label>
                 <Textarea id="desc" {...form.register("description")} className="bg-background/50 border-white/10" />
              </div>
              <Button type="submit" className="w-full" disabled={createEvent.isPending}>
                {createEvent.isPending ? "Creating..." : "Publish Event"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events?.map((event) => (
            <div key={event.id} className="glass-card p-6 rounded-xl border-l-4 border-l-primary hover:bg-card/80 transition-colors">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-primary/10 text-primary px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">
                        {event.status}
                    </div>
                    <span className="text-emerald-400 font-bold">${(event.entryFee / 100).toFixed(2)}</span>
                </div>
                
                <h3 className="text-xl font-bold font-display text-white mb-2">{event.title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{event.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-white/5 pt-4">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(event.startDate).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {event.location}</span>
                </div>
                
                <Button className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white">
                    View Details
                </Button>
            </div>
        ))}
        {events?.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
                No upcoming events found.
            </div>
        )}
      </div>
    </AppLayout>
  );
}
