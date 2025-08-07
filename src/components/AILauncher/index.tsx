import React, { useState } from 'react';
import { TextArea95, Button95, Select95 } from '../Windows95UI';
import { AIModel } from '../../types';

const AI_MODELS: AIModel[] = [
  { id: 'claude', name: 'Claude', url: 'https://claude.ai/new' },
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chat.openai.com/' },
  { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com/app' }
];

export const AILauncher: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedAI, setSelectedAI] = useState('claude');

  const launchAI = () => {
    if (!prompt.trim()) return;

    const model = AI_MODELS.find(m => m.id === selectedAI);
    if (!model) return;

    navigator.clipboard.writeText(prompt).then(() => {
      window.open(model.url, '_blank');
      setPrompt('');
      alert(`Prompt copied to clipboard! Paste it in ${model.name} chat.`);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Select95 value={selectedAI} onChange={(e) => setSelectedAI(e.target.value)}>
        {AI_MODELS.map(model => (
          <option key={model.id} value={model.id}>{model.name}</option>
        ))}
      </Select95>
      <TextArea95
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        style={{ minHeight: '80px' }}
      />
      <Button95 onClick={launchAI} disabled={!prompt.trim()}>
        🤖 Launch {AI_MODELS.find(m => m.id === selectedAI)?.name}
      </Button95>
    </div>
  );
};