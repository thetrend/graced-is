import { defineCollection, z } from "astro:content";

const posts = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.coerce.date(),
		category: z.string(),
		tags: z.array(z.string()),
		image: z.string().default("/static/blog-placeholder.png"),
	}),
});

export const collections = { posts };
