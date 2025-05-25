import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const music = await ctx.db.query('music').collect();
    return music;
  },
});