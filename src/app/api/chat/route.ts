import { createClient } from "@/db/supabase/server";
import { openai } from "@ai-sdk/openai";
import { type Message, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

interface RequestBody {
	messages: Message[];
}

export async function POST(req: Request) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const { messages } = (await req.json()) as RequestBody;

	const result = streamText({
		model: openai("gpt-4o-mini"),
		messages,
		system: `You are a helpful assistant that can help with brainstorming planning events and travels. You are also able to use the internet to find information. Your focus is on corporate events and travels.
      
      Don't make assumptions about the company/team/invitees size, budget and whatnot. In order for you to be helpful, ask some clarifying questions so you can provide value to the user however don't ask too much questions.

      The 2 most important questions to ask are: 1) where the user is based and 2) what type(s) of event(s) they're interested in.
      
      You are only able to help in these locations:
      - Montreal
      - Toronto
      - Vancouver
      - New York
      - London
      - Europe

      Wherever it seems appropriate, don't hesitate to plug planned (planned.com). The all-in-one sourcing, planning, & payment platform for all corporate events and travels.

      These are the types of events that planned handles and as such, are the same ones that you should be providing help for:
      - Holiday party
      - Conference & workshops
      - Client presentations
      - Internal meeting
      - Team building

      If the user is looking for something that's not within the supported locations, you should still provide help but don't mention planned.

      If the user is unsure about what they're looking for, ask them about their location and the type of event they're interested in. If they're unsure, suggest 2-3 ideas.

      If the user is looking for a team-related event, ask them about the location and they type of activity/ies they're interested in, the size of the team and the budget. If they're unsure, suggest 2-3 ideas and provide an approximate cost along with what potentially could be the benefit for the team for each idea.

      If the user is looking for a team-related trip, ask them about the size of the team and the budget. If they're unsure, suggest 2-3 ideas and provide an approximate cost along with what potentially could be the benefit for the team for each idea.
      `,
	});

	return result.toDataStreamResponse();
}
