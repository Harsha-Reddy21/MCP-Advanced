
import React, { useState } from 'react';
import { Upload, FileText, Brain, BarChart3, Settings } from 'lucide-react';
import PDFUploader from '@/components/PDFUploader';
import ChunkingStrategies from '@/components/ChunkingStrategies';
import ChunkVisualizer from '@/components/ChunkVisualizer';
import StrategyExplanation from '@/components/StrategyExplanation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

const Index = () => {
  const [pdfText, setPdfText] = useState<string>('');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('fixed-size');
  const [chunks, setChunks] = useState<any[]>([]);
  const [chunkSize, setChunkSize] = useState(500);
  const [overlap, setOverlap] = useState(50);
  const [allChunks, setAllChunks] = useState<{[key: string]: any[]}>({});

  const strategies = [
    { value: 'fixed-size', label: 'Fixed Size' },
    { value: 'semantic', label: 'Semantic' },
    { value: 'sentence', label: 'Sentence-based' },
    { value: 'paragraph', label: 'Paragraph-based' },
    { value: 'sliding-window', label: 'Sliding Window' },
    { value: 'recursive', label: 'Recursive Character' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RAG Chunking Strategy Visualizer
              </h1>
              <p className="text-slate-600 text-sm">Explore and compare different document chunking approaches</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Upload Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Document Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PDFUploader onTextExtracted={setPdfText} />
            </CardContent>
          </Card>
        </div>

        {/* Global Settings */}
        {pdfText && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Global Chunk Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                      Chunk Size: {chunkSize} characters
                    </Label>
                    <Slider
                      value={[chunkSize]}
                      onValueChange={([value]) => setChunkSize(value)}
                      min={100}
                      max={2000}
                      step={50}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700 mb-2 block">
                      Overlap: {overlap} characters
                    </Label>
                    <Slider
                      value={[overlap]}
                      onValueChange={([value]) => setOverlap(value)}
                      min={0}
                      max={Math.min(chunkSize / 2, 200)}
                      step={10}
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Side by Side Strategy Comparison */}
        {pdfText && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {strategies.map((strategy) => (
              <Card key={strategy.value} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                    {strategy.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <ChunkingStrategies
                    selectedStrategy={strategy.value}
                    onStrategyChange={() => {}} // Not needed for side-by-side view
                    pdfText={pdfText}
                    onChunksGenerated={(chunks) => {
                      setAllChunks(prev => ({
                        ...prev,
                        [strategy.value]: chunks
                      }));
                    }}
                    chunkSize={chunkSize}
                    overlap={overlap}
                    readOnly={true}
                  />
                  <div className="mt-4">
                    <ChunkVisualizer 
                      chunks={allChunks[strategy.value] || []} 
                      strategy={strategy.value}
                      compact={true}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Strategy Explanation Section */}
        {pdfText && (
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {strategies.map((strategy) => (
                <StrategyExplanation key={strategy.value} strategy={strategy.value} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
