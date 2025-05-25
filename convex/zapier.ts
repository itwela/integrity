import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const insertZapData = mutation({
  args: {
    email: v.string(),
    payment_amount: v.number(),
    payment_status: v.string(),
    receipt_url: v.string(),
    product_id: v.string(),
    createdAt: v.number(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('zapierLogs', {
      email: args.email,
      payment_amount: args.payment_amount,
      payment_status: args.payment_status,
      receipt_url: args.receipt_url,
      product_id: args.product_id,
      name: args.name,
      createdAt: args.createdAt,
    });
  },
}); 