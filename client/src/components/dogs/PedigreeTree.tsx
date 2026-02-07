import { Dog } from "@shared/schema";
import { cn } from "@/lib/utils";

interface PedigreeNodeProps {
  dog: Dog | null | undefined;
  depth: number;
  label: string;
}

function PedigreeNode({ dog, depth, label }: PedigreeNodeProps) {
  if (!dog) {
    return (
      <div className={cn(
        "p-2 rounded border border-white/5 bg-white/5 text-muted-foreground text-xs flex items-center justify-center h-full min-h-[60px]",
        depth === 0 ? "border-primary/50 bg-primary/10" : ""
      )}>
        <span className="opacity-50">Unknown {label}</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-3 rounded-lg border border-white/10 bg-card/50 flex flex-col justify-center h-full min-h-[80px] hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer group",
      depth === 0 ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : ""
    )}>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 group-hover:text-primary/70">{label}</div>
      <div className="font-display font-semibold text-sm truncate text-white">{dog.name}</div>
      <div className="flex items-center justify-between mt-1">
        {dog.titles && <span className="text-[10px] text-amber-400 truncate max-w-[60%]">{dog.titles}</span>}
        <span className="text-[10px] text-muted-foreground">{dog.registrationNo}</span>
      </div>
    </div>
  );
}

interface PedigreeTreeProps {
  dog: any; // Using any for nested structure simplicity
}

export function PedigreeTree({ dog }: PedigreeTreeProps) {
  if (!dog) return null;

  return (
    <div className="w-full overflow-x-auto p-6 bg-card rounded-xl border border-white/5">
      <div className="min-w-[800px] flex gap-8">
        {/* Generation 1 (Self) */}
        <div className="w-1/4 flex flex-col justify-center">
          <PedigreeNode dog={dog} depth={0} label="Subject" />
        </div>

        {/* Generation 2 (Parents) */}
        <div className="w-1/4 flex flex-col gap-4">
          <div className="flex-1">
            <PedigreeNode dog={dog.sire} depth={1} label="Sire" />
          </div>
          <div className="flex-1">
            <PedigreeNode dog={dog.dam} depth={1} label="Dam" />
          </div>
        </div>

        {/* Generation 3 (Grandparents) - Simplified logic assuming structure exists */}
        <div className="w-1/4 flex flex-col gap-2">
          {/* Sire's Parents */}
          <div className="flex-1"><PedigreeNode dog={dog.sire?.sire} depth={2} label="Paternal Grandsire" /></div>
          <div className="flex-1"><PedigreeNode dog={dog.sire?.dam} depth={2} label="Paternal Granddam" /></div>
          
          {/* Dam's Parents */}
          <div className="flex-1"><PedigreeNode dog={dog.dam?.sire} depth={2} label="Maternal Grandsire" /></div>
          <div className="flex-1"><PedigreeNode dog={dog.dam?.dam} depth={2} label="Maternal Granddam" /></div>
        </div>

        {/* Generation 4 (Great Grandparents) */}
        <div className="w-1/4 flex flex-col gap-1 text-xs">
           <div className="flex-1"><PedigreeNode dog={dog.sire?.sire?.sire} depth={3} label="G.G. Sire" /></div>
           <div className="flex-1"><PedigreeNode dog={dog.sire?.sire?.dam} depth={3} label="G.G. Dam" /></div>
           <div className="flex-1"><PedigreeNode dog={dog.sire?.dam?.sire} depth={3} label="G.G. Sire" /></div>
           <div className="flex-1"><PedigreeNode dog={dog.sire?.dam?.dam} depth={3} label="G.G. Dam" /></div>
           <div className="flex-1"><PedigreeNode dog={dog.dam?.sire?.sire} depth={3} label="G.G. Sire" /></div>
           <div className="flex-1"><PedigreeNode dog={dog.dam?.sire?.dam} depth={3} label="G.G. Dam" /></div>
           <div className="flex-1"><PedigreeNode dog={dog.dam?.dam?.sire} depth={3} label="G.G. Sire" /></div>
           <div className="flex-1"><PedigreeNode dog={dog.dam?.dam?.dam} depth={3} label="G.G. Dam" /></div>
        </div>
      </div>
    </div>
  );
}
