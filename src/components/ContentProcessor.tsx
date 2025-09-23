import React, { useState, useCallback } from 'react';
import { Upload, FileText, Video, Image, BookOpen, Brain, Sparkles, Download, Copy, Check } from 'lucide-react';

interface ProcessedContent {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  explanations: {
    concept: string;
    explanation: string;
    example?: string;
  }[];
  visualElements: {
    type: 'diagram' | 'chart' | 'timeline' | 'concept-map';
    title: string;
    description: string;
  }[];
}

const ContentProcessor: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [processedContent, setProcessedContent] = useState<ProcessedContent | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processContent = async () => {
    setProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock processed content
    const mockContent: ProcessedContent = {
      id: '1',
      title: 'Introduction to Machine Learning',
      summary: 'Machine Learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.',
      keyPoints: [
        'Machine Learning uses algorithms to find patterns in data',
        'Three main types: Supervised, Unsupervised, and Reinforcement Learning',
        'Applications include recommendation systems, image recognition, and natural language processing',
        'Requires large datasets and computational power for training',
        'Model evaluation is crucial to prevent overfitting and ensure generalization'
      ],
      explanations: [
        {
          concept: 'Supervised Learning',
          explanation: 'A type of machine learning where the algorithm learns from labeled training data to make predictions on new, unseen data.',
          example: 'Email spam detection: The algorithm is trained on emails labeled as "spam" or "not spam" to classify new emails.'
        },
        {
          concept: 'Overfitting',
          explanation: 'When a model learns the training data too well, including noise and irrelevant patterns, making it perform poorly on new data.',
          example: 'Like memorizing answers to practice questions without understanding concepts - you fail when faced with new questions.'
        },
        {
          concept: 'Feature Engineering',
          explanation: 'The process of selecting, modifying, or creating new input variables (features) to improve model performance.',
          example: 'For house price prediction, creating a "price per square foot" feature from existing price and area data.'
        }
      ],
      visualElements: [
        {
          type: 'diagram',
          title: 'ML Algorithm Types',
          description: 'Visual breakdown of supervised, unsupervised, and reinforcement learning with examples'
        },
        {
          type: 'concept-map',
          title: 'ML Workflow',
          description: 'Step-by-step process from data collection to model deployment'
        }
      ]
    };
    
    setProcessedContent(mockContent);
    setProcessing(false);
  };

  const copyToClipboard = async () => {
    if (!processedContent) return;
    
    const text = `${processedContent.title}\n\n${processedContent.summary}\n\nKey Points:\n${processedContent.keyPoints.map(point => `• ${point}`).join('\n')}`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (file.type.startsWith('video/')) return <Video className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light via-white to-brand-sage/20 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-sage/20 text-brand-slate text-sm font-medium mb-6 font-body">
            <Brain className="w-4 h-4 mr-2 text-brand-green" />
            AI-Powered Content Processing
          </div>
          <h1 className="text-4xl md:text-5xl font-header font-bold text-brand-navy mb-6">
            Transform Your Study Materials
          </h1>
          <p className="text-xl text-brand-slate max-w-3xl mx-auto font-body leading-relaxed">
            Upload textbook pages, lecture videos, or images and get AI-generated study notes 
            with clear explanations and visual learning aids.
          </p>
        </div>

        {!processedContent ? (
          <div className="space-y-8">
            {/* Upload Area */}
            <div className="card p-8">
              <h2 className="text-2xl font-header font-bold text-brand-navy mb-6 flex items-center">
                <Upload className="w-6 h-6 mr-3 text-brand-green" />
                Upload Your Materials
              </h2>
              
              <div
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 font-body ${
                  dragActive 
                    ? 'border-brand-green bg-brand-sage/10' 
                    : 'border-brand-sage hover:border-brand-green hover:bg-brand-light/50'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="space-y-4">
                  <div className="flex justify-center space-x-4">
                    <div className="w-12 h-12 bg-brand-sage/20 rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-brand-green" />
                    </div>
                    <div className="w-12 h-12 bg-brand-sage/20 rounded-full flex items-center justify-center">
                      <Video className="w-6 h-6 text-brand-green" />
                    </div>
                    <div className="w-12 h-12 bg-brand-sage/20 rounded-full flex items-center justify-center">
                      <Image className="w-6 h-6 text-brand-green" />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-lg font-medium text-brand-navy mb-2">
                      Drop your files here or click to browse
                    </p>
                    <p className="text-brand-slate/70">
                      Supports PDFs, images, videos, and text files up to 50MB
                    </p>
                  </div>
                  
                  <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png,.mp4,.mov,.txt,.docx"
                  />
                  <label
                    htmlFor="file-upload"
                    className="btn-primary cursor-pointer"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Choose Files
                  </label>
                </div>
              </div>

              {/* Uploaded Files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-header font-semibold text-brand-navy mb-4">Uploaded Files</h3>
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-brand-light/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-brand-slate/70">
                            {getFileIcon(file)}
                          </div>
                          <div>
                            <p className="font-medium text-brand-navy font-body">{file.name}</p>
                            <p className="text-sm text-brand-slate/70 font-body">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-brand-slate/50 hover:text-brand-slate transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Process Button */}
              {uploadedFiles.length > 0 && (
                <div className="mt-8 text-center">
                  <button
                    onClick={processContent}
                    disabled={processing}
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-brand-green to-brand-slate text-white rounded-lg hover:from-brand-green/90 hover:to-brand-slate/90 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-body font-medium"
                  >
                    {processing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Processing Content...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-3" />
                        Generate Study Notes
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Processing Status */}
            {processing && (
              <div className="card p-8 text-center">
                <div className="animate-pulse space-y-4">
                  <div className="w-16 h-16 bg-brand-sage/20 rounded-full flex items-center justify-center mx-auto">
                    <Brain className="w-8 h-8 text-brand-green" />
                  </div>
                  <h3 className="text-xl font-header font-semibold text-brand-navy">AI is analyzing your content...</h3>
                  <p className="text-brand-slate font-body">This may take a few moments while we extract key concepts and generate explanations.</p>
                  <div className="w-64 h-2 bg-brand-sage/30 rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-brand-green to-brand-slate rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Processed Content Display */
          <div className="space-y-8">
            {/* Header with Actions */}
            <div className="card p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-header font-bold text-brand-navy mb-2">{processedContent.title}</h2>
                  <p className="text-brand-slate font-body">Generated study notes and explanations</p>
                </div>
                <div className="flex space-x-3 mt-4 md:mt-0">
                  <button
                    onClick={copyToClipboard}
                    className="btn-secondary"
                  >
                    {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button className="btn-primary">
                    <Download className="w-4 h-4 mr-2" />
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-brand-sage/10 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-header font-semibold text-brand-navy mb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Summary
                </h3>
                <p className="text-brand-slate leading-relaxed font-body">{processedContent.summary}</p>
              </div>

              {/* Key Points */}
              <div className="mb-8">
                <h3 className="text-xl font-header font-semibold text-brand-navy mb-4">Key Points to Remember</h3>
                <div className="space-y-3">
                  {processedContent.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-brand-light/50 rounded-lg">
                      <div className="w-6 h-6 bg-brand-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-brand-green text-sm font-semibold">{index + 1}</span>
                      </div>
                      <p className="text-brand-slate leading-relaxed font-body">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Explanations */}
            <div className="card p-8">
              <h3 className="text-2xl font-header font-bold text-brand-navy mb-6 flex items-center">
                <Brain className="w-6 h-6 mr-3 text-brand-green" />
                Detailed Explanations
              </h3>
              <div className="space-y-6">
                {processedContent.explanations.map((item, index) => (
                  <div key={index} className="border-l-4 border-brand-green pl-6 py-4">
                    <h4 className="text-lg font-header font-semibold text-brand-navy mb-3">{item.concept}</h4>
                    <p className="text-brand-slate mb-4 leading-relaxed font-body">{item.explanation}</p>
                    {item.example && (
                      <div className="bg-brand-sage/10 rounded-lg p-4">
                        <p className="text-sm font-medium text-brand-navy mb-2 font-body">Example:</p>
                        <p className="text-brand-slate italic font-body">{item.example}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Elements */}
            <div className="card p-8">
              <h3 className="text-2xl font-header font-bold text-brand-navy mb-6 flex items-center">
                <Sparkles className="w-6 h-6 mr-3 text-brand-green" />
                Visual Learning Aids
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                {processedContent.visualElements.map((element, index) => (
                  <div key={index} className="border-2 border-dashed border-brand-sage rounded-xl p-8 text-center hover:border-brand-green transition-colors">
                    <div className="w-16 h-16 bg-brand-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Image className="w-8 h-8 text-brand-green" />
                    </div>
                    <h4 className="text-lg font-header font-semibold text-brand-navy mb-2">{element.title}</h4>
                    <p className="text-brand-slate text-sm mb-4 font-body">{element.description}</p>
                    <button className="text-brand-green hover:text-brand-slate font-medium text-sm font-body">
                      Generate Visual →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="text-center space-y-4">
              <button
                onClick={() => {
                  setProcessedContent(null);
                  setUploadedFiles([]);
                }}
                className="inline-flex items-center px-6 py-3 bg-brand-slate text-white rounded-lg hover:bg-brand-slate/90 transition-colors mr-4 font-body font-medium"
              >
                Process New Content
              </button>
              <button className="btn-primary">
                Add to Study Deck
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentProcessor;