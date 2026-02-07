import { AppLayout } from "@/components/layout/AppLayout";
import { useDogs, useCreateDog, useBreeds } from "@/hooks/use-dogs";
import { DogCard } from "@/components/dogs/DogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Search, Plus, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDogSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Enhance schema with string coercion for dates
const formSchema = insertDogSchema.extend({
  birthDate: z.string(), // Input type="date" returns string
  breedId: z.coerce.number(),
});

type FormData = z.infer<typeof formSchema>;

export default function DogsList() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { data: dogs, isLoading } = useDogs({ search });
  const { data: breeds } = useBreeds();
  const createDog = useCreateDog();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sex: "male",
      status: "active",
    },
  });

  const onSubmit = (data: FormData) => {
    createDog.mutate(data as any, {
      onSuccess: () => {
        setIsCreateOpen(false);
        form.reset();
        toast({ title: "Success", description: "Dog registered successfully" });
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      },
    });
  };

  return (
    <AppLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">My Kennel</h1>
          <p className="text-muted-foreground mt-1">Manage your breeding stock and show dogs.</p>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or reg #" 
              className="pl-9 bg-card border-white/10 min-w-[250px]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                <Plus className="w-4 h-4" /> Register Dog
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-white/10 text-white max-w-lg">
              <DialogHeader>
                <DialogTitle>Register New Dog</DialogTitle>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Call Name</Label>
                    <Input id="name" {...form.register("name")} className="bg-background/50 border-white/10" />
                    {form.formState.errors.name && <p className="text-destructive text-xs">{form.formState.errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="regNo">Registration #</Label>
                    <Input id="regNo" {...form.register("registrationNo")} className="bg-background/50 border-white/10" />
                    {form.formState.errors.registrationNo && <p className="text-destructive text-xs">{form.formState.errors.registrationNo.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="breed">Breed</Label>
                    <Select onValueChange={(val) => form.setValue("breedId", parseInt(val))}>
                      <SelectTrigger className="bg-background/50 border-white/10">
                        <SelectValue placeholder="Select breed" />
                      </SelectTrigger>
                      <SelectContent>
                        {breeds?.map(breed => (
                          <SelectItem key={breed.id} value={String(breed.id)}>{breed.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {form.formState.errors.breedId && <p className="text-destructive text-xs">{form.formState.errors.breedId.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input type="date" id="dob" {...form.register("birthDate")} className="bg-background/50 border-white/10" />
                    {form.formState.errors.birthDate && <p className="text-destructive text-xs">{form.formState.errors.birthDate.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Sex</Label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" value="male" {...form.register("sex")} className="accent-primary" />
                      <span>Male</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" value="female" {...form.register("sex")} className="accent-primary" />
                      <span>Female</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input id="image" {...form.register("imageUrl")} placeholder="https://..." className="bg-background/50 border-white/10" />
                </div>

                <Button type="submit" className="w-full mt-4" disabled={createDog.isPending}>
                  {createDog.isPending ? "Creating..." : "Create Record"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dogs?.map((dog, i) => (
            <DogCard key={dog.id} dog={dog} index={i} />
          ))}
          {dogs?.length === 0 && (
            <div className="col-span-full py-20 text-center border border-dashed border-white/10 rounded-xl bg-card/30">
              <Dog className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium text-white">No dogs found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search or register a new dog.</p>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
