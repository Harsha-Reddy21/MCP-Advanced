import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface ChunkingStrategiesProps {
  selectedStrategy: string;
  onStrategyChange: (strategy: string) => void;
  pdfText: string;
  onChunksGenerated: (chunks: any[]) => void;
  chunkSize?: number;
  overlap?: number;
  readOnly?: boolean;
}

const ChunkingStrategies: React.FC<ChunkingStrategiesProps> = ({
  selectedStrategy,
  onStrategyChange,
  pdfText,
  onChunksGenerated,
  chunkSize: externalChunkSize,
  overlap: externalOverlap,
  readOnly = false
}) => {
  const [internalChunkSize, setInternalChunkSize] = useState(500);
  const [internalOverlap, setInternalOverlap] = useState(50);

  const chunkSize = externalChunkSize ?? internalChunkSize;
  const overlap = externalOverlap ?? internalOverlap;

  const strategies = [
    { value: 'fixed-size', label: 'Fixed Size Chunking' },
    { value: 'semantic', label: 'Semantic Chunking' },
    { value: 'sentence', label: 'Sentence-based' },
    { value: 'paragraph', label: 'Paragraph-based' },
    { value: 'sliding-window', label: 'Sliding Window' },
    { value: 'recursive', label: 'Recursive Character' }
  ];

  const generateChunks = (text: string, strategy: string) => {
    if (!text) return [];

    const chunks = [];
    let chunkId = 0;

    switch (strategy) {
      case 'fixed-size':
        for (let i = 0; i < text.length; i += chunkSize) {
          const chunk = text.slice(i, i + chunkSize);
          chunks.push({
            id: chunkId++,
            text: chunk,
            start: i,
            end: i + chunk.length,
            size: chunk.length,
            strategy: 'Fixed Size',
            metadata: { chunkSize, position: Math.floor(i / chunkSize) + 1 }
          });
        }
        break;

      case 'sentence':
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        sentences.forEach((sentence, index) => {
          const trimmed = sentence.trim();
          if (trimmed) {
            chunks.push({
              id: chunkId++,
              text: trimmed,
              start: 0, // Simplified for demo
              end: trimmed.length,
              size: trimmed.length,
              strategy: 'Sentence-based',
              metadata: { sentenceNumber: index + 1, wordCount: trimmed.split(' ').length }
            });
          }
        });
        break;

      case 'paragraph':
        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        paragraphs.forEach((paragraph, index) => {
          const trimmed = paragraph.trim();
          if (trimmed) {
            chunks.push({
              id: chunkId++,
              text: trimmed,
              start: 0, // Simplified for demo
              end: trimmed.length,
              size: trimmed.length,
              strategy: 'Paragraph-based',
              metadata: { paragraphNumber: index + 1, sentenceCount: trimmed.split(/[.!?]+/).length - 1 }
            });
          }
        });
        break;

      case 'sliding-window':
        const step = chunkSize - overlap;
        for (let i = 0; i < text.length; i += step) {
          const chunk = text.slice(i, i + chunkSize);
          if (chunk.length > overlap) { // Don't create tiny chunks at the end
            chunks.push({
              id: chunkId++,
              text: chunk,
              start: i,
              end: i + chunk.length,
              size: chunk.length,
              strategy: 'Sliding Window',
              metadata: { 
                chunkSize, 
                overlap, 
                position: Math.floor(i / step) + 1,
                overlapWithPrevious: i > 0 ? overlap : 0
              }
            });
          }
        }
        break;

      case 'semantic':
        // Simplified semantic chunking - in reality, this would use NLP
        const semanticChunks = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
        semanticChunks.forEach((chunk, index) => {
          const trimmed = chunk.trim();
          if (trimmed) {
            chunks.push({
              id: chunkId++,
              text: trimmed,
              start: 0,
              end: trimmed.length,
              size: trimmed.length,
              strategy: 'Semantic',
              metadata: { 
                semanticUnit: index + 1, 
                coherenceScore: Math.random() * 0.3 + 0.7, // Simulated score
                topicKeywords: ['AI', 'processing', 'systems'].slice(0, Math.floor(Math.random() * 3) + 1)
              }
            });
          }
        });
        break;

      case 'recursive':
        // Simplified recursive character splitting
        const recursiveSplit = (text: string, separators: string[], currentSep: number = 0): string[] => {
          if (currentSep >= separators.length) {
            return text.length <= chunkSize ? [text] : [text.slice(0, chunkSize)];
          }
          
          const parts = text.split(separators[currentSep]);
          const result = [];
          let current = '';
          
          for (const part of parts) {
            if ((current + part).length <= chunkSize) {
              current += (current ? separators[currentSep] : '') + part;
            } else {
              if (current) result.push(current);
              if (part.length <= chunkSize) {
                current = part;
              } else {
                result.push(...recursiveSplit(part, separators, currentSep + 1));
                current = '';
              }
            }
          }
          if (current) result.push(current);
          return result;
        };

        const recursiveChunks = recursiveSplit(text, ['\n\n', '\n', '. ', ' ']);
        recursiveChunks.forEach((chunk, index) => {
          chunks.push({
            id: chunkId++,
            text: chunk,
            start: 0,
            end: chunk.length,
            size: chunk.length,
            strategy: 'Recursive Character',
            metadata: { 
              level: index + 1,
              splitType: chunk.includes('\n\n') ? 'paragraph' : chunk.includes('\n') ? 'line' : 'sentence'
            }
          });
        });
        break;

      default:
        break;
    }

    return chunks;
  };

  useEffect(() => {
    if (pdfText) {
      const newChunks = generateChunks(pdfText, selectedStrategy);
      onChunksGenerated(newChunks);
    }
  }, [pdfText, selectedStrategy, chunkSize, overlap]);

  if (readOnly) {
    const chunks = generateChunks(pdfText, selectedStrategy);
    const avgChunkSize = chunks.length > 0 ? chunks.reduce((sum, chunk) => sum + chunk.size, 0) / chunks.length : 0;
    
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs">
            {chunks.length} chunks
          </Badge>
          <Badge variant="secondary" className="text-xs">
            Avg: {Math.round(avgChunkSize)} chars
          </Badge>
        </div>
        <div className="text-sm text-slate-600">
          Strategy: <span className="font-medium">{strategies.find(s => s.value === selectedStrategy)?.label}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="strategy-select" className="text-sm font-medium text-slate-700 mb-2 block">
          Select Strategy
        </Label>
        <Select value={selectedStrategy} onValueChange={onStrategyChange}>
          <SelectTrigger id="strategy-select">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {strategies.map((strategy) => (
              <SelectItem key={strategy.value} value={strategy.value}>
                {strategy.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!externalChunkSize && (selectedStrategy === 'fixed-size' || selectedStrategy === 'sliding-window' || selectedStrategy === 'recursive') && (
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Chunk Size: {internalChunkSize} characters
          </Label>
          <Slider
            value={[internalChunkSize]}
            onValueChange={([value]) => setInternalChunkSize(value)}
            min={100}
            max={2000}
            step={50}
            className="w-full"
          />
        </div>
      )}

      {!externalOverlap && selectedStrategy === 'sliding-window' && (
        <div>
          <Label className="text-sm font-medium text-slate-700 mb-2 block">
            Overlap: {internalOverlap} characters
          </Label>
          <Slider
            value={[internalOverlap]}
            onValueChange={([value]) => setInternalOverlap(value)}
            min={0}
            max={Math.min(internalChunkSize / 2, 200)}
            step={10}
            className="w-full"
          />
        </div>
      )}
    </div>
  );
};

export default ChunkingStrategies;
