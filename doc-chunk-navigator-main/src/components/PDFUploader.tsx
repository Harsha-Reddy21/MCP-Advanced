
import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PDFUploaderProps {
  onTextExtracted: (text: string) => void;
}

const PDFUploader: React.FC<PDFUploaderProps> = ({ onTextExtracted }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');
  const { toast } = useToast();

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // For this demo, we'll simulate PDF text extraction
          // In a real implementation, you'd use a library like pdf-parse
          const sampleText = `
This is a sample document text extracted from the PDF. In a real implementation, this would contain the actual content from your uploaded PDF file.

The document discusses various topics including natural language processing, machine learning, and information retrieval systems. These systems are designed to understand and process human language in a way that computers can comprehend.

One important aspect of these systems is the ability to break down large documents into smaller, manageable chunks. This process, known as chunking, is crucial for effective information retrieval and processing.

There are several strategies for chunking documents:

1. Fixed-size chunking: This approach divides the text into chunks of a predetermined size, typically measured in characters or tokens.

2. Semantic chunking: This method attempts to preserve the meaning and context by breaking text at natural boundaries like sentences or paragraphs.

3. Sliding window: This technique creates overlapping chunks to ensure that important information at chunk boundaries is not lost.

Each strategy has its own advantages and trade-offs. Fixed-size chunking is simple and predictable but may break sentences or concepts. Semantic chunking preserves meaning but may result in variable chunk sizes. Sliding window approaches help maintain context but create redundancy.

The choice of chunking strategy depends on the specific use case, the nature of the documents, and the requirements of the downstream processing system.

In retrieval-augmented generation (RAG) systems, the quality of chunking directly affects the system's ability to find relevant information and generate accurate responses.

Modern RAG systems often experiment with different chunking strategies to optimize performance for their specific domain and use case.
          `;
          
          setTimeout(() => {
            resolve(sampleText);
          }, 1500); // Simulate processing time
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const text = await extractTextFromPDF(file);
      setExtractedText(text);
      onTextExtracted(text);
      toast({
        title: "PDF processed successfully",
        description: `Extracted ${text.length} characters from the document`,
      });
    } catch (error) {
      console.error('Error extracting text:', error);
      toast({
        title: "Error processing PDF",
        description: "Failed to extract text from the document",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : extractedText 
              ? 'border-green-300 bg-green-50' 
              : 'border-slate-300 hover:border-slate-400 bg-slate-50'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {isProcessing ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-slate-600">Processing PDF...</p>
          </div>
        ) : extractedText ? (
          <div className="flex flex-col items-center space-y-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <p className="text-sm text-green-700 font-medium">PDF processed successfully</p>
            <p className="text-xs text-slate-500">{extractedText.length} characters extracted</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <Upload className="h-8 w-8 text-slate-400" />
            <div>
              <p className="text-sm font-medium text-slate-700">Drop your PDF here, or</p>
              <label className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                click to browse
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-slate-500">Maximum file size: 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFUploader;
