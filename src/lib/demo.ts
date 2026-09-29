import type { ModelId } from '../types';

export function createDemoReply(
  prompt: string,
  model: ModelId,
  context = '',
): string {
  const text = prompt.toLowerCase();
  const intro =
    model === 'claude'
      ? 'Here is a thoughtful starting point.'
      : model === 'deepseek'
        ? 'Let’s break this into clear steps.'
        : 'Let’s make a little progress.';
  if (context) {
    const sentences = context
      .replace(/\s+/g, ' ')
      .match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [context];
    return `Local text preview\n\n${sentences
      .slice(0, 3)
      .map((s) => `• ${s.trim()}`)
      .join(
        '\n\n',
      )}\n\nThese are excerpts from your context, not an AI-generated summary. A connected model would synthesize and explain them.`;
  }
  if (/react|plan|learn/.test(text))
    return `${intro}\n\n1. Start small. Choose one concrete outcome you can finish this week.\n2. Build a first version. Work in short sessions and try each idea immediately.\n3. Review what works. Keep a short list of questions and revisit difficult parts.\n4. Share the result. Explain your decisions and use feedback for the next iteration.\n\nWhat would you like to focus on first?`;
  if (/email|write|draft|rewrite/.test(text))
    return `${intro}\n\nHi there,\n\nI’m excited to connect and learn more about what you’re working on. I’d love to hear about your priorities and where I can help.\n\nWould you have a few minutes for a quick introduction this week?\n\nBest,\n[Your name]\n\nYou can personalize the tone, recipient, and details before using this draft.`;
  if (/idea|brainstorm|creat/.test(text))
    return `${intro}\n\n• A study planner that turns a big deadline into small daily steps.\n• A quiet reading space that keeps notes beside the article.\n• A peer feedback board for sharing unfinished work.\n• A reusable checklist for starting new projects.\n• A daily reflection that connects progress to your original goal.\n\nPick one idea and describe who it would help.`;
  if (/explain|language model|understand/.test(text))
    return `${intro}\n\nImagine a very well-read writing partner. A language model learns patterns in text and uses the conversation to predict what might come next.\n\nThat makes it useful for drafting and exploring ideas, but a convincing response is not always a correct one. Check important claims against reliable sources.\n\nThis is a prepared example to demonstrate the conversation interface.`;
  return `${intro}\n\nYou asked: “${prompt.slice(0, 240)}”\n\nThis frontend demo uses prepared responses. In a connected app, your chosen model would answer this specific question.\n\nTry a writing, learning, planning, or brainstorming prompt to explore the example flows.`;
}
