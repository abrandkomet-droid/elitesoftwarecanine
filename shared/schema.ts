import { pgTable, text, serial, integer, boolean, timestamp, date, real, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./models/auth";

// Export everything from auth models
export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const breeds = pgTable("breeds", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  group: text("group").notNull(), // e.g., "Herding", "Terrier"
  standardDescription: text("standard_description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const dogs = pgTable("dogs", {
  id: serial("id").primaryKey(),
  microchipId: text("microchip_id").unique(),
  registrationNo: text("registration_no").unique().notNull(),
  name: text("name").notNull(),
  breedId: integer("breed_id").references(() => breeds.id),
  sex: text("sex", { enum: ["male", "female"] }).notNull(),
  birthDate: date("birth_date").notNull(),
  sireId: integer("sire_id"), // Self-reference added in relations
  damId: integer("dam_id"),   // Self-reference added in relations
  ownerId: varchar("owner_id").references(() => users.id),
  breederId: varchar("breeder_id").references(() => users.id),
  coiScore: real("coi_score").default(0),
  dnaToken: text("dna_token"),
  imageUrl: text("image_url"),
  titles: text("titles"), // Comma separated or JSON
  status: text("status", { enum: ["active", "deceased", "transferred"] }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const healthRecords = pgTable("health_records", {
  id: serial("id").primaryKey(),
  dogId: integer("dog_id").references(() => dogs.id).notNull(),
  testCode: text("test_code").notNull(),
  resultData: text("result_data").notNull(),
  labName: text("lab_name").notNull(),
  verifiedAt: timestamp("verified_at"),
  documentUrl: text("document_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  location: text("location").notNull(),
  entryFee: integer("entry_fee").notNull(), // In cents
  maxEntries: integer("max_entries"),
  status: text("status", { enum: ["upcoming", "ongoing", "completed", "cancelled"] }).default("upcoming"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const showResults = pgTable("show_results", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  dogId: integer("dog_id").references(() => dogs.id).notNull(),
  placement: text("placement"), // "1st", "2nd", "BIS", etc.
  pointsEarned: integer("points_earned").default(0),
  judgeName: text("judge_name"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===

export const dogsRelations = relations(dogs, ({ one, many }) => ({
  breed: one(breeds, {
    fields: [dogs.breedId],
    references: [breeds.id],
  }),
  owner: one(users, {
    fields: [dogs.ownerId],
    references: [users.id],
    relationName: "ownedDogs",
  }),
  breeder: one(users, {
    fields: [dogs.breederId],
    references: [users.id],
    relationName: "bredDogs",
  }),
  sire: one(dogs, {
    fields: [dogs.sireId],
    references: [dogs.id],
    relationName: "sireRelation",
  }),
  dam: one(dogs, {
    fields: [dogs.damId],
    references: [dogs.id],
    relationName: "damRelation",
  }),
  offspringAsSire: many(dogs, { relationName: "sireRelation" }),
  offspringAsDam: many(dogs, { relationName: "damRelation" }),
  healthRecords: many(healthRecords),
  showResults: many(showResults),
}));

export const breedsRelations = relations(breeds, ({ many }) => ({
  dogs: many(dogs),
}));

export const healthRecordsRelations = relations(healthRecords, ({ one }) => ({
  dog: one(dogs, {
    fields: [healthRecords.dogId],
    references: [dogs.id],
  }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  results: many(showResults),
}));

export const showResultsRelations = relations(showResults, ({ one }) => ({
  event: one(events, {
    fields: [showResults.eventId],
    references: [events.id],
  }),
  dog: one(dogs, {
    fields: [showResults.dogId],
    references: [dogs.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  ownedDogs: many(dogs, { relationName: "ownedDogs" }),
  bredDogs: many(dogs, { relationName: "bredDogs" }),
}));

// === ZOD SCHEMAS ===

export const insertBreedSchema = createInsertSchema(breeds).omit({ id: true, createdAt: true });
export const insertDogSchema = createInsertSchema(dogs).omit({ id: true, createdAt: true, coiScore: true });
export const insertHealthRecordSchema = createInsertSchema(healthRecords).omit({ id: true, createdAt: true });
export const insertEventSchema = createInsertSchema(events).omit({ id: true, createdAt: true });
export const insertShowResultSchema = createInsertSchema(showResults).omit({ id: true, createdAt: true });

// === EXPLICIT API TYPES ===

export type Breed = typeof breeds.$inferSelect;
export type Dog = typeof dogs.$inferSelect;
export type HealthRecord = typeof healthRecords.$inferSelect;
export type Event = typeof events.$inferSelect;
export type ShowResult = typeof showResults.$inferSelect;

export type CreateDogRequest = z.infer<typeof insertDogSchema>;
export type UpdateDogRequest = Partial<CreateDogRequest>;
export type DogWithRelations = Dog & {
  breed?: Breed;
  sire?: Dog;
  dam?: Dog;
  owner?: User;
  breeder?: User;
  healthRecords?: HealthRecord[];
  showResults?: ShowResult[];
};
