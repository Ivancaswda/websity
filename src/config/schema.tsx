import {integer, pgTable, varchar, text, json, timestamp} from "drizzle-orm/pg-core";

export const usersTable = pgTable('users', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({length: 255}).notNull(),
    email: varchar({length: 255}).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    credits: integer().default(0),
    createdAt: varchar(),
    avatarUrl: varchar()
})

export const projectTable = pgTable('projects', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    projectId: varchar(),
    createdBy: varchar().references(() => usersTable.email),
    createdOn: timestamp().defaultNow()
})



export const frameTable = pgTable('frames', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    frameId: varchar(),
    designCode: text(),
    projectId: varchar().references(() => projectTable.projectId)
})


export const chatTable = pgTable('chats', {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    chatMessages: json(),
    frameId: varchar().references(() => frameTable.frameId),
    createdBy: varchar().references(() => usersTable.email),
    createdOn: timestamp().defaultNow()
})











