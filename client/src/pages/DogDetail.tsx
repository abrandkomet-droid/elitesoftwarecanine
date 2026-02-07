import { AppLayout } from "@/components/layout/AppLayout";
import { useDog, useDogPedigree } from "@/hooks/use-dogs";
import { useRoute } from "wouter";
import { Loader2, Calendar, Dna, Activity, Trophy, Share2 } from "lucide-react";
import { PedigreeTree } from "@/components/dogs/PedigreeTree";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function DogDetail() {
  const [, params] = useRoute("/dogs/:id");
  const id = parseInt(params?.id || "0");
  const { data: dog, isLoading } = useDog(id);
  const { data: pedigree } = useDogPedigree(id);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </AppLayout>
    );
  }

  if (!dog) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold">Dog not found</h1>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header Section */}
      <div className="relative mb-8 rounded-3xl overflow-hidden bg-card border border-white/5">
        <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/20 relative">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay" />
        </div>
        
        <div className="px-8 pb-8 flex flex-col md:flex-row gap-8 items-start -mt-20 relative z-10">
          <div className="w-40 h-40 rounded-2xl overflow-hidden border-4 border-card shadow-xl bg-muted">
            {dog.imageUrl ? (
              <img src={dog.imageUrl} alt={dog.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                <Dna className="w-16 h-16" />
              </div>
            )}
          </div>
          
          <div className="flex-1 pt-20 md:pt-24 space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/20">
                {dog.status.toUpperCase()}
              </span>
              <span className="text-sm text-muted-foreground">Reg: {dog.registrationNo}</span>
            </div>
            
            <h1 className="text-4xl font-bold font-display text-white">{dog.name}</h1>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
              <span className="flex items-center gap-1.5">
                <Dna className="w-4 h-4 text-primary" /> {dog.breed?.name}
              </span>
              <span className="flex items-center gap-1.5 capitalize">
                {dog.sex}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Born {new Date(dog.birthDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="pt-24 flex gap-3">
             <Button variant="outline" className="border-white/10 hover:bg-white/5">
                <Share2 className="w-4 h-4 mr-2" /> Share
             </Button>
             <Button>Edit Profile</Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="pedigree" className="space-y-6">
        <TabsList className="bg-card/50 border border-white/5 p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Overview</TabsTrigger>
          <TabsTrigger value="pedigree" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Pedigree</TabsTrigger>
          <TabsTrigger value="health" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Health Records</TabsTrigger>
          <TabsTrigger value="results" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Show Results</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-amber-400" /> Titles & Achievements</h3>
                    {dog.titles ? (
                        <div className="flex flex-wrap gap-2">
                            {dog.titles.split(',').map((t, i) => (
                                <span key={i} className="px-3 py-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 rounded-lg text-sm font-medium">
                                    {t.trim()}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground">No titles recorded yet.</p>
                    )}
                </div>
                <div className="glass-card p-6 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-400" /> Genetic Coefficient</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold font-display">{dog.coiScore}%</span>
                        <span className="text-muted-foreground mb-1">COI</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                        Calculated over 4 generations. Lower is generally preferred for genetic diversity.
                    </p>
                </div>
            </div>
        </TabsContent>

        <TabsContent value="pedigree" className="min-h-[400px]">
          <PedigreeTree dog={pedigree} />
        </TabsContent>

        <TabsContent value="health">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Verified Health Tests</h3>
                <Button variant="outline" size="sm"><Activity className="w-4 h-4 mr-2" /> Add Record</Button>
            </div>
            
            {dog.healthRecords && dog.healthRecords.length > 0 ? (
                <div className="space-y-4">
                    {dog.healthRecords.map((record, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                            <div>
                                <h4 className="font-semibold">{record.testCode}</h4>
                                <p className="text-sm text-muted-foreground">{record.labName}</p>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-emerald-400">{record.resultData}</div>
                                <div className="text-xs text-muted-foreground">{new Date(record.verifiedAt).toLocaleDateString()}</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-8">No health records on file.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="results">
             <div className="glass-card p-6 rounded-xl">
                 <h3 className="text-lg font-semibold mb-4">Competition History</h3>
                 <p className="text-muted-foreground">No show results recorded.</p>
             </div>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
