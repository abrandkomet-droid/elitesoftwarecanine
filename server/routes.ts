import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth Setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // Dogs
  app.get(api.dogs.list.path, async (req, res) => {
    try {
      const input = api.dogs.list.input?.parse(req.query);
      const dogs = await storage.getDogs(input);
      res.json(dogs);
    } catch (err) {
      res.status(400).json({ message: "Invalid query parameters" });
    }
  });

  app.get(api.dogs.get.path, async (req, res) => {
    const dog = await storage.getDog(Number(req.params.id));
    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }
    // In a real app, verify relations/hydration here
    res.json(dog);
  });

  app.post(api.dogs.create.path, async (req, res) => {
    // Use auth check here if needed: if (!req.isAuthenticated()) ...
    try {
      const input = api.dogs.create.input.parse(req.body);
      const dog = await storage.createDog(input);
      res.status(201).json(dog);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.dogs.update.path, async (req, res) => {
    try {
      const input = api.dogs.update.input.parse(req.body);
      const dog = await storage.updateDog(Number(req.params.id), input);
      res.json(dog);
    } catch (err) {
      res.status(400).json({ message: "Validation error" });
    }
  });

  app.get(api.dogs.getPedigree.path, async (req, res) => {
    const dog = await storage.getDog(Number(req.params.id));
    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }
    // Mock pedigree tree
    const pedigree = {
      subject: dog,
      sire: dog.sireId ? await storage.getDog(dog.sireId) : null,
      dam: dog.damId ? await storage.getDog(dog.damId) : null,
      // ... recurse in real logic
    };
    res.json(pedigree);
  });

  // Breeds
  app.get(api.breeds.list.path, async (req, res) => {
    const breeds = await storage.getBreeds();
    res.json(breeds);
  });

  // Events
  app.get(api.events.list.path, async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });
  
  app.post(api.events.create.path, async (req, res) => {
    const event = await storage.createEvent(req.body);
    res.status(201).json(event);
  });

  // Health
  app.post(api.healthRecords.create.path, async (req, res) => {
    const record = await storage.addHealthRecord(req.body);
    res.status(201).json(record);
  });
  
  // Seed function
  seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const breeds = await storage.getBreeds();
  if (breeds.length === 0) {
    const createdBreeds = [];
    const breedData = [
      { name: "German Shepherd", group: "Herding" },
      { name: "French Bulldog", group: "Non-Sporting" },
      { name: "Golden Retriever", group: "Sporting" },
      { name: "Siberian Husky", group: "Working" }
    ];
    
    for (const b of breedData) {
      createdBreeds.push(await storage.createBreed(b));
    }

    const dogData = [
      { 
        name: "Rex", 
        registrationNo: "GS-001", 
        breedId: createdBreeds[0].id, 
        sex: "male" as const, 
        birthDate: "2020-01-01",
        microchipId: "900123456789001"
      },
      { 
        name: "Luna", 
        registrationNo: "GS-002", 
        breedId: createdBreeds[0].id, 
        sex: "female" as const, 
        birthDate: "2020-06-15",
        microchipId: "900123456789002"
      },
      { 
        name: "Max", 
        registrationNo: "FB-001", 
        breedId: createdBreeds[1].id, 
        sex: "male" as const, 
        birthDate: "2021-03-10",
        microchipId: "900123456789003"
      }
    ];

    const dogs = [];
    for (const d of dogData) {
      dogs.push(await storage.createDog(d));
    }
    
    // Create offspring
    await storage.createDog({
      name: "Rocky",
      registrationNo: "GS-003",
      breedId: createdBreeds[0].id,
      sex: "male",
      birthDate: "2022-01-01",
      sireId: dogs[0].id,
      damId: dogs[1].id,
      microchipId: "900123456789004"
    });
    
    // Create Event
    await storage.createEvent({
      slug: "national-specialty-2024",
      title: "2024 National Specialty",
      startDate: new Date("2024-05-15"),
      location: "Dallas, TX",
      entryFee: 5000,
      maxEntries: 100
    });
  }
}
