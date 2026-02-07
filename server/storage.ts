import { db } from "./db";
import { 
  dogs, breeds, events, healthRecords, showResults, users,
  type CreateDogRequest, type UpdateDogRequest, type Dog, type Breed, type Event, type HealthRecord, type ShowResult, type User
} from "@shared/schema";
import { eq, like, or, sql, desc, and } from "drizzle-orm";

export interface IStorage {
  // Dogs
  getDogs(filters?: { search?: string; limit?: number; offset?: number; breedId?: number; ownerId?: string }): Promise<Dog[]>;
  getDog(id: number): Promise<Dog | undefined>;
  createDog(dog: CreateDogRequest): Promise<Dog>;
  updateDog(id: number, updates: UpdateDogRequest): Promise<Dog>;
  
  // Breeds
  getBreeds(): Promise<Breed[]>;
  getBreed(id: number): Promise<Breed | undefined>;
  createBreed(breed: any): Promise<Breed>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: any): Promise<Event>;

  // Health
  addHealthRecord(record: any): Promise<HealthRecord>;
  
  // Users (partial, mostly handled by auth storage but good to have access)
  getUser(id: string): Promise<User | undefined>;
  
  // Advanced
  calculateCOI(dogId: number): Promise<number>;
}

export class DatabaseStorage implements IStorage {
  async getDogs(filters?: { search?: string; limit?: number; offset?: number; breedId?: number; ownerId?: string }): Promise<Dog[]> {
    let query = db.select().from(dogs);
    
    const conditions = [];
    if (filters?.search) {
      conditions.push(or(
        like(dogs.name, `%${filters.search}%`),
        like(dogs.registrationNo, `%${filters.search}%`),
        like(dogs.microchipId, `%${filters.search}%`)
      ));
    }
    if (filters?.breedId) {
      conditions.push(eq(dogs.breedId, filters.breedId));
    }
    if (filters?.ownerId) {
      conditions.push(eq(dogs.ownerId, filters.ownerId));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    if (filters?.limit) {
      query = query.limit(filters.limit) as any;
    }
    if (filters?.offset) {
      query = query.offset(filters.offset) as any;
    }

    return await query.orderBy(desc(dogs.createdAt));
  }

  async getDog(id: number): Promise<Dog | undefined> {
    const [dog] = await db.select().from(dogs).where(eq(dogs.id, id));
    return dog;
  }

  async createDog(dog: CreateDogRequest): Promise<Dog> {
    const [newDog] = await db.insert(dogs).values(dog).returning();
    return newDog;
  }

  async updateDog(id: number, updates: UpdateDogRequest): Promise<Dog> {
    const [updated] = await db.update(dogs).set(updates).where(eq(dogs.id, id)).returning();
    return updated;
  }

  async getBreeds(): Promise<Breed[]> {
    return await db.select().from(breeds);
  }

  async getBreed(id: number): Promise<Breed | undefined> {
    const [breed] = await db.select().from(breeds).where(eq(breeds.id, id));
    return breed;
  }
  
  async createBreed(breed: any): Promise<Breed> {
    const [newBreed] = await db.insert(breeds).values(breed).returning();
    return newBreed;
  }

  async getEvents(): Promise<Event[]> {
    return await db.select().from(events);
  }

  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }
  
  async createEvent(event: any): Promise<Event> {
    const [newEvent] = await db.insert(events).values(event).returning();
    return newEvent;
  }

  async addHealthRecord(record: any): Promise<HealthRecord> {
    const [newRecord] = await db.insert(healthRecords).values(record).returning();
    return newRecord;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  
  async calculateCOI(dogId: number): Promise<number> {
    // Placeholder for Wright's method
    // In a real app, this would traverse the graph.
    // For now, we return a random reasonable value or 0.
    return 0.0;
  }
}

export const storage = new DatabaseStorage();
