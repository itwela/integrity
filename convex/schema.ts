import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  stripeLogs: defineTable({
    email: v.string(),
    payment_amount: v.number(),
    payment_status: v.string(),
    product_id: v.string(),
    createdAt: v.number(),
    name: v.string(),
    tracking_number: v.optional(v.string()),
    has_shipped: v.optional(v.boolean()),
    address: v.optional(v.object({
      name: v.string(),
      line_1: v.string(),
      line_2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
    })),
    quantity_to_ship: v.optional(v.number()),
  }).index('by_createdAt', ['createdAt'])
    .index('by_has_shipped', ['has_shipped']),

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