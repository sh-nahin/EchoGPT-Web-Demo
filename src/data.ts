import type { Model } from './types';

// A small, representative model catalog for the frontend concept.
export const models: Model[] = [
  {
    id: 'echo',
    name: 'EchoGPT',
    provider: 'EchoGPT',
    description: 'A starting point for everyday questions',
    mark: 'e',
    color: 'blue',
  },
  {
    id: 'gpt',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Explore ideas, write, and work through problems',
    mark: '◎',
    color: 'green',
  },
  {
    id: 'claude',
    name: 'Claude Sonnet',
    provider: 'Anthropic',
    description: 'Shape thoughtful drafts and longer conversations',
    mark: '✳',
    color: 'orange',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    provider: 'Google',
    description: 'Bring a different perspective to your questions',
    mark: '✦',
    color: 'blue',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    description: 'Break down technical questions step by step',
    mark: '≈',
    color: 'blue',
  },
  {
    id: 'llama',
    name: 'Llama',
    provider: 'Meta',
    description: 'An open-model family to explore',
    mark: '∞',
    color: 'green',
  },
];

export const prompts = [
  {
    category: 'Write',
    title: 'Find the right words',
    text: 'Help me write a friendly introduction email to a new teammate.',
  },
  {
    category: 'Learn',
    title: 'Make a complex idea click',
    text: 'Explain how a large language model works using a simple analogy.',
  },
  {
    category: 'Code',
    title: 'Build something useful',
    text: 'Create a practical one-week plan to learn the basics of React.',
  },
  {
    category: 'Brainstorm',
    title: 'Find your next idea',
    text: 'Brainstorm five fresh ideas for a student productivity app.',
  },
];
