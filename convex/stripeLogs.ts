import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const insertStripeData = mutation({
  args: {
    email: v.string(),
    payment_amount: v.number(),
    payment_status: v.string(),
    product_id: v.string(),
    createdAt: v.number(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('stripeLogs', {
      email: args.email,
      payment_amount: args.payment_amount,
      payment_status: args.payment_status,
      product_id: args.product_id,
      name: args.name,
      createdAt: args.createdAt,
    });
  },
});

export const checkEmailAccess = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query('stripeLogs')
      .filter((q) => q.eq(q.field('email'), args.email))
      .first();
    return !!record;
  },
}); 