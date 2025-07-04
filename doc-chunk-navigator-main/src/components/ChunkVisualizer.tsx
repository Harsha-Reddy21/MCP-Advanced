import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, BarChart3, Info } from 'lucide-react';

interface Chunk {
  id: number;
  text: string;
  start: number;
  end: number;
  size: number;
  strategy: string;
  metadata: any;
}

interface ChunkVisualizerProps {
  chunks: Chunk[];
  strategy: string;
  compact?: boolean;
}

const ChunkVisualizer: React.FC<ChunkVisualizerProps> = ({ chunks, strategy, compact = false }) => {
  const [selectedChunk, setSelectedChunk] = useState<Chunk | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'stats'>('list');

  if (chunks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <BarChart3 className="h-8 w-8 text-slate-300 mb-2" />
        <p className="text-slate-500 text-sm">No chunks generated</p>
      </div>
    );
  }

  const getChunkColor = (index: number) => {
    const colors = [
      'bg-blue-100 border-blue-200 text-blue-800',
      'bg-purple-100 border-purple-200 text-purple-800',
      'bg-green-100 border-green-200 text-green-800',
      'bg-orange-100 border-orange-200 text-orange-800',
      'bg-pink-100 border-pink-200 text-pink-800',
      'bg-indigo-100 border-indigo-200 text-indigo-800'
    ];
    return colors[index % colors.length];
  };

  const avgChunkSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0) / chunks.length;
  const minChunkSize = Math.min(...chunks.map(c => c.size));
  const maxChunkSize = Math.max(...chunks.map(c => c.size));

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">{chunks.length} chunks</span>
          <span className="text-slate-500">Avg: {Math.round(avgChunkSize)}</span>
        </div>
        
        <ScrollArea className="h-48">
          <div className="space-y-2">
            {chunks.slice(0, 5).map((chunk, index) => (
              <Card
                key={chunk.id}
                className="cursor-pointer transition-all hover:shadow-sm"
                onClick={() => setSelectedChunk(chunk)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between mb-1">
                    <Badge variant="outline" className={`text-xs ${getChunkColor(index)}`}>
                      #{chunk.id + 1}
                    </Badge>
                    <span className="text-xs text-slate-500">{chunk.size}c</span>
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-2">
                    {chunk.text.substring(0, 80)}
                    {chunk.text.length > 80 && '...'}
                  </p>
                </CardContent>
              </Card>
            ))}
            {chunks.length > 5 && (
              <div className="text-center text-xs text-slate-500 py-2">
                ... and {chunks.length - 5} more chunks
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              viewMode === 'list' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-1" />
            Chunks
          </button>
          <button
            onClick={() => setViewMode('stats')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
              viewMode === 'stats' 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-1" />
            Statistics
          </button>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span>{chunks.length} chunks</span>
          <span>•</span>
          <span>Avg: {Math.round(avgChunkSize)} chars</span>
        </div>
      </div>

      {viewMode === 'stats' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{chunks.length}</div>
              <div className="text-sm text-slate-600">Total Chunks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{Math.round(avgChunkSize)}</div>
              <div className="text-sm text-slate-600">Avg Size (chars)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">{minChunkSize} - {maxChunkSize}</div>
              <div className="text-sm text-slate-600">Size Range</div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Chunks List */}
          <div>
            <ScrollArea className="h-96 pr-4">
              <div className="space-y-3">
                {chunks.map((chunk, index) => (
                  <Card
                    key={chunk.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedChunk?.id === chunk.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedChunk(chunk)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className={getChunkColor(index)}>
                          Chunk {chunk.id + 1}
                        </Badge>
                        <span className="text-xs text-slate-500">{chunk.size} chars</span>
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-3">
                        {chunk.text.substring(0, 150)}
                        {chunk.text.length > 150 && '...'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chunk Details */}
          <div>
            {selectedChunk ? (
              <Card className="h-96">
                <CardContent className="p-4 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <Info className="h-4 w-4 text-blue-600" />
                    <h3 className="font-medium text-slate-800">Chunk Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-slate-500">ID:</span>
                      <span className="ml-2 font-medium">{selectedChunk.id + 1}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Size:</span>
                      <span className="ml-2 font-medium">{selectedChunk.size} chars</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Strategy:</span>
                      <span className="ml-2 font-medium">{selectedChunk.strategy}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Position:</span>
                      <span className="ml-2 font-medium">{selectedChunk.start}-{selectedChunk.end}</span>
                    </div>
                  </div>

                  {selectedChunk.metadata && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-700 mb-2">Metadata</h4>
                      <div className="text-xs text-slate-600 space-y-1">
                        {Object.entries(selectedChunk.metadata).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-mono">{Array.isArray(value) ? value.join(', ') : String(value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <ScrollArea className="flex-1">
                    <div className="text-sm text-slate-700 whitespace-pre-wrap">
                      {selectedChunk.text}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-96">
                <CardContent className="p-4 flex items-center justify-center h-full">
                  <div className="text-center text-slate-500">
                    <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Select a chunk to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChunkVisualizer;
