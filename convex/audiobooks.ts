import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const audiobooks = await ctx.db.query('audiobooks').collect();
    return audiobooks;
  },
});