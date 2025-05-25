import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  emailValidation: defineTable({
    email: v.string(),
    isAuthenticated: v.boolean(),
    createdAt: v.optional(v.number()),
  }),
  zapierLogs: defineTable({
    email: v.string(),
    payment_amount: v.number(),
    payment_status: v.string(),
    receipt_url: v.string(),
    product_id: v.string(),
    createdAt: v.number(),
    name: v.string(),
  }),
  music: defineTable({
    audio_files: v.array(v.object({
      id: v.number(),
      image: v.string(),
      url: v.string(),
      title: v.string(),
      tags: v.array(v.string()),
    })),
    audio_image: v.string(),
    audio_name: v.string(),
    audio_description_1: v.string(),
    audio_description_2: v.string(),
    audio_release_date: v.string(),
  }),
  audiobooks: defineTable({
    audio_files: v.array(v.object({
      id: v.number(),
      image: v.string(),
      url: v.string(),
      title: v.string(),
      tags: v.array(v.string()),
    })),
    audio_image: v.string(),
    audio_name: v.string(),
    audio_description_1: v.string(),
    audio_description_2: v.string(),
    audio_release_date: v.string(),
  }),
}); 