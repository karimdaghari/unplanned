import { tool as createTool } from "ai";
import { z } from "zod";

export const venueTool = createTool({
	description: "Suggest a venue for an event",
	parameters: z.object({
		location: z.string().describe("The location of the venue"),
		numVenue: z.number().optional().describe("number of venues to return"),
	}),
	execute: async ({ numVenue }) => {
		await new Promise((resolve) => setTimeout(resolve, 2000));

		const data = [
			{
				name: "Pullman Quay",
				location: "Sydney",
				country: "Australia",
				price: "$40,200",
				imageUrl:
					"https://planned-cms.imgix.net/_1600xAUTO_crop_center-center_none_ns/Event-venue-Sydney-_-Planned.webp",
				description:
					"Set against the stunning backdrop of Sydney Harbour, Pullman Quay offers a modern, upscale event space with panoramic waterfront views and exceptional service.",
			},
			{
				name: "Century Club",
				location: "London",
				country: "United Kingdom",
				price: "$10,200",
				imageUrl:
					"https://planned-cms.imgix.net/_1600xAUTO_crop_center-center_none_ns/Rooftop-Venue-London-Planned.webp",
				description:
					"Nestled in historic London, Century Club blends classic elegance with contemporary flair, providing a refined setting ideal for intimate gatherings.",
			},
			{
				name: "Société Bar",
				location: "Montréal",
				country: "Canada",
				price: "$21,200",
				imageUrl:
					"https://planned-cms.imgix.net/_1600xAUTO_crop_center-center_none_ns/Cocktail-Bar-Montreal-_-Planned.webp",
				description:
					"Located in trendy Montréal, Société Bar captivates with its chic industrial design and an intimate atmosphere perfect for stylish soirées.",
			},
			{
				name: "Contra Studios",
				location: "New York",
				country: "United States",
				price: "$12,200",
				imageUrl:
					"https://planned-cms.imgix.net/_1600xAUTO_crop_center-center_none_ns/Event-Venue-New-York-_-Planned.webp",
				description:
					"In the heart of New York, Contra Studios offers a dynamic, versatile space with urban sophistication, making it a top choice for creative events.",
			},
		].slice(0, numVenue);

		return { data };
	},
});

export const tools = {
	displayVenue: venueTool,
};
