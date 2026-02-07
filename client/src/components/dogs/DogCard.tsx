import { Dog } from "@shared/schema";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Dna, Award } from "lucide-react";

interface DogCardProps {
  dog: Dog & { breed?: { name: string } };
  index?: number;
}

export function DogCard({ dog, index = 0 }: DogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/dogs/${dog.id}`} className="block h-full">
        <div className="group h-full bg-card rounded-xl border border-white/5 overflow-hidden hover:border-primary/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-300">
          <div className="aspect-[4/3] bg-muted relative overflow-hidden">
            {dog.imageUrl ? (
              <img 
                src={dog.imageUrl} 
                alt={dog.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted/50">
                <Dna className="w-12 h-12 text-muted-foreground/20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            
            <div className="absolute bottom-3 left-3 right-3">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-primary/20 text-primary-foreground backdrop-blur-md rounded-md border border-primary/20 mb-2">
                {dog.registrationNo}
              </span>
              <h3 className="text-lg font-bold text-white font-display truncate group-hover:text-primary transition-colors">
                {dog.name}
              </h3>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Breed</span>
              <span className="font-medium text-foreground">{dog.breed?.name || "Unknown"}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Sex</span>
              <span className="capitalize font-medium text-foreground">{dog.sex}</span>
            </div>

            {dog.titles && (
              <div className="flex gap-2 flex-wrap pt-2 border-t border-white/5">
                {dog.titles.split(',').slice(0, 3).map((title, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    <Award className="w-3 h-3" /> {title.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
