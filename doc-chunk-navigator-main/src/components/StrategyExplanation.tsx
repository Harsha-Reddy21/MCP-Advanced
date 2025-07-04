
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface StrategyExplanationProps {
  strategy: string;
}

const StrategyExplanation: React.FC<StrategyExplanationProps> = ({ strategy }) => {
  const strategyInfo = {
    'fixed-size': {
      title: 'Fixed Size Chunking',
      description: 'Divides text into chunks of predetermined size, typically measured in characters or tokens.',
      pros: [
        'Predictable chunk sizes',
        'Simple to implement',
        'Consistent memory usage',
        'Fast processing'
      ],
      cons: [
        'May break sentences mid-way',
        'Ignores semantic boundaries',
        'Can split related concepts',
        'Poor context preservation'
      ],
      useCases: [
        'Large document processing',
        'Memory-constrained environments',
        'When speed is priority',
        'Uniform chunk requirements'
      ],
      color: 'blue'
    },
    'semantic': {
      title: 'Semantic Chunking',
      description: 'Attempts to preserve meaning and context by breaking text at natural semantic boundaries.',
      pros: [
        'Preserves meaning and context',
        'Natural content boundaries',
        'Better retrieval relevance',
        'Concept coherence'
      ],
      cons: [
        'Variable chunk sizes',
        'Computationally expensive',
        'Requires NLP processing',
        'Complex implementation'
      ],
      useCases: [
        'Question-answering systems',
        'Content summarization',
        'Academic document processing',
        'Knowledge extraction'
      ],
      color: 'purple'
    },
    'sentence': {
      title: 'Sentence-based Chunking',
      description: 'Splits text at sentence boundaries, ensuring each chunk contains complete sentences.',
      pros: [
        'Complete thoughts preserved',
        'Natural reading flow',
        'Good for QA systems',
        'Maintains grammar'
      ],
      cons: [
        'Highly variable sizes',
        'May be too granular',
        'Complex sentences issues',
        'Limited context window'
      ],
      useCases: [
        'Conversational AI',
        'Fine-grained search',
        'Sentence similarity',
        'Educational content'
      ],
      color: 'green'
    },
    'paragraph': {
      title: 'Paragraph-based Chunking',
      description: 'Divides text into chunks based on paragraph boundaries, maintaining topical coherence.',
      pros: [
        'Topical coherence',
        'Natural content structure',
        'Good context preservation',
        'Reader-friendly chunks'
      ],
      cons: [
        'Very variable sizes',
        'May be too large',
        'Depends on formatting',
        'Inconsistent boundaries'
      ],
      useCases: [
        'Document summarization',
        'Topic modeling',
        'Content analysis',
        'Blog post processing'
      ],
      color: 'orange'
    },
    'sliding-window': {
      title: 'Sliding Window',
      description: 'Creates overlapping chunks to ensure important information at boundaries is not lost.',
      pros: [
        'Context preservation',
        'Reduced information loss',
        'Better boundary handling',
        'Improved retrieval'
      ],
      cons: [
        'Data redundancy',
        'Increased storage',
        'Processing overhead',
        'Duplicate information'
      ],
      useCases: [
        'Critical information retrieval',
        'Medical documents',
        'Legal text processing',
        'Technical documentation'
      ],
      color: 'pink'
    },
    'recursive': {
      title: 'Recursive Character Splitting',
      description: 'Hierarchically splits text using multiple separators, trying to maintain semantic boundaries.',
      pros: [
        'Flexible approach',
        'Maintains structure',
        'Good size control',
        'Semantic awareness'
      ],
      cons: [
        'Complex implementation',
        'Processing overhead',
        'Parameter tuning needed',
        'Variable performance'
      ],
      useCases: [
        'Code documentation',
        'Structured documents',
        'Multi-format content',
        'Hierarchical data'
      ],
      color: 'indigo'
    }
  };

  const info = strategyInfo[strategy as keyof typeof strategyInfo];
  if (!info) return null;

  const colorMap = {
    blue: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50',
    green: 'border-green-200 bg-green-50',
    orange: 'border-orange-200 bg-orange-50',
    pink: 'border-pink-200 bg-pink-50',
    indigo: 'border-indigo-200 bg-indigo-50'
  };

  return (
    <Card className={`${colorMap[info.color as keyof typeof colorMap]} border-2`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="h-5 w-5" />
          {info.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-700">{info.description}</p>
        
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              Advantages
            </h4>
            <div className="space-y-1">
              {info.pros.map((pro, index) => (
                <div key={index} className="text-xs text-slate-600 flex items-center gap-2">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  {pro}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-1">
              <XCircle className="h-4 w-4" />
              Limitations
            </h4>
            <div className="space-y-1">
              {info.cons.map((con, index) => (
                <div key={index} className="text-xs text-slate-600 flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  {con}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-amber-700 mb-2 flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Best Use Cases
            </h4>
            <div className="flex flex-wrap gap-1">
              {info.useCases.map((useCase, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {useCase}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyExplanation;
