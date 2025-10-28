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
    tracking_number: v.string(),
    has_shipped: v.boolean(),
    address: v.optional(v.object({
      name: v.string(),
      line_1: v.string(),
      line_2: v.optional(v.string()),
      city: v.string(),
      state: v.string(),
      zip: v.string(),
    })),
    quantity_to_ship: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Calculate quantity based on payment amount (bottles are $65 each)
    const calculatedQuantity = Math.floor(args.payment_amount / 6500); // 6500 cents = $65
    
    await ctx.db.insert('stripeLogs', {
      email: args.email,
      payment_amount: args.payment_amount,
      payment_status: args.payment_status,
      product_id: args.product_id,
      name: args.name,
      createdAt: args.createdAt,
      tracking_number: args.tracking_number,
      has_shipped: args.has_shipped,
      address: args.address,
      quantity_to_ship: calculatedQuantity || args.quantity_to_ship || 1,
    });
  },

});

export const checkEmailAccess = query({

  args: { email: v.string() },
  handler: async (ctx, args) => {
    // Perform case-insensitive email lookup
    const allRecords = await ctx.db
      .query('stripeLogs')
      .collect();
    
    const record = allRecords.find(
      (r) => r.email.toLowerCase() === args.email.toLowerCase()
    );
    
    return !!record;
  },

}); 

export const getStripeLogsThatHaveNotShipped = query({

  args: {},
  handler: async (ctx, args) => {

    const falseRecords = await ctx.db
      .query('stripeLogs')
      .filter((q) => q.eq(q.field('has_shipped'), false))
      .order('desc')
      .take(100);

    const undefinedRecords = await ctx.db
      .query('stripeLogs')
      .filter((q) => q.eq(q.field('has_shipped'), undefined))
      .order('desc')
      .take(1000);

    const combinedRecords = [...falseRecords, ...undefinedRecords];

    return combinedRecords.map(record => ({
      id: record._id,
      name: record.name,
      email: record.email,
      address: record.address,
      quantity_to_ship: record.quantity_to_ship,
    }));
  },

});

export const updateShippedStatus = mutation({

  args: { id: v.id('stripeLogs'), has_shipped: v.boolean(), tracking_number: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { has_shipped: args.has_shipped, tracking_number: args.tracking_number });
  },

});

export const updateAddressAndQuantityToShip = mutation({

  args: { id: v.id('stripeLogs'), address: v.object({
    name: v.string(),
    line_1: v.string(),
    line_2: v.optional(v.string()),
    city: v.string(),
    state: v.string(),
    zip: v.string(),
  }), quantity_to_ship: v.number() }, 
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { address: args.address, quantity_to_ship: args.quantity_to_ship });
  },

});
