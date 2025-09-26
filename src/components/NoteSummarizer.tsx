import React, { useState } from 'react';
import { Brain, FileText, Sparkles, Copy, Check, Download, Wand2 } from 'lucide-react';

interface SummaryResult {
  original: string;
  summary: string;
  keyPoints: string[];
  concepts: string[];
  timestamp: Date;
}

const NoteSummarizer: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<SummaryResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [summaryType, setSummaryType] = useState<'brief' | 'detailed' | 'bullet'>('brief');

  const handleSummarize = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI summary generation
    const mockSummary: SummaryResult = {
      original: inputText,
      summary: generateMockSummary(inputText, summaryType),
      keyPoints: generateKeyPoints(inputText),
      concepts: extractConcepts(inputText),
      timestamp: new Date()
    };
    
    setSummaryResult(mockSummary);
    setIsProcessing(false);
  };

  const generateMockSummary = (text: string, type: string): string => {
    const wordCount = text.split(' ').length;
    
    if (type === 'brief') {
      return `This content covers key concepts in ${Math.ceil(wordCount / 50)} main areas. The material discusses fundamental principles and their applications, providing essential knowledge for understanding the subject matter. Key relationships between concepts are highlighted to facilitate better comprehension and retention.`;
    } else if (type === 'detailed') {
      return `This comprehensive content explores multiple interconnected concepts across ${Math.ceil(wordCount / 30)} distinct sections. The material begins by establishing foundational principles, then progresses through intermediate concepts, and concludes with advanced applications. Each section builds upon previous knowledge while introducing new terminology and methodologies. The content emphasizes practical applications and real-world examples to enhance understanding. Critical thinking elements are woven throughout to encourage deeper analysis and synthesis of information.`;
    } else {
      return `• Main topic covers ${Math.ceil(wordCount / 40)} key areas\n• Fundamental principles are clearly defined\n• Practical applications are provided\n• Examples illustrate key concepts\n• Connections between ideas are established`;
    }
  };

  const generateKeyPoints = (text: string): string[] => {
    const sentences = text.split('.').filter(s => s.trim().length > 20);
    const keyPoints = sentences.slice(0, Math.min(5, Math.ceil(sentences.length / 3)));
    
    return keyPoints.map((point, index) => 
      `${point.trim().substring(0, 100)}${point.length > 100 ? '...' : ''}`
    );
  };

  const extractConcepts = (text: string): string[] => {
    // Mock concept extraction
    const words = text.toLowerCase().split(/\W+/);
    const concepts = words
      .filter(word => word.length > 6)
      .slice(0, 8)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1));
    
    return [...new Set(concepts)];
  };

  const copyToClipboard = async () => {
    if (!summaryResult) return;
    
    const text = `Summary:\n${summaryResult.summary}\n\nKey Points:\n${summaryResult.keyPoints.map(point => `• ${point}`).join('\n')}\n\nKey Concepts:\n${summaryResult.concepts.join(', ')}`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const reset = () => {
    setInputText('');
    setSummaryResult(null);
    setCopied(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-header font-bold text-brand-navy mb-2">Note Summarizer</h1>
        <p className="text-brand-slate font-body">
          Transform lengthy notes into concise, memorable summaries using AI
        </p>
      </div>

      {!summaryResult ? (
        <div className="space-y-6">
          {/* Input Section */}
          <div className="card p-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-brand-sage/20 rounded-xl flex items-center justify-center mr-4">
                <FileText className="w-6 h-6 text-brand-green" />
              </div>
              <div>
                <h2 className="text-xl font-header font-bold text-brand-navy">Paste Your Notes</h2>
                <p className="text-brand-slate font-body">Copy and paste your lecture notes, textbook excerpts, or study materials</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-brand-navy mb-2 font-body">
                  Summary Type
                </label>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setSummaryType('brief')}
                    className={`px-4 py-2 rounded-lg font-body transition-colors ${
                      summaryType === 'brief'
                        ? 'bg-brand-green text-white'
                        : 'bg-brand-sage/20 text-brand-slate hover:bg-brand-sage/30'
                    }`}
                  >
                    Brief
                  </button>
                  <button
                    onClick={() => setSummaryType('detailed')}
                    className={`px-4 py-2 rounded-lg font-body transition-colors ${
                      summaryType === 'detailed'
                        ? 'bg-brand-green text-white'
                        : 'bg-brand-sage/20 text-brand-slate hover:bg-brand-sage/30'
                    }`}
                  >
                    Detailed
                  </button>
                  <button
                    onClick={() => setSummaryType('bullet')}
                    className={`px-4 py-2 rounded-lg font-body transition-colors ${
                      summaryType === 'bullet'
                        ? 'bg-brand-green text-white'
                        : 'bg-brand-sage/20 text-brand-slate hover:bg-brand-sage/30'
                    }`}
                  >
                    Bullet Points
                  </button>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your notes here... The more content you provide, the better the summary will be. Include lecture notes, textbook passages, or any study material you want to condense."
                className="w-full h-64 px-4 py-3 border border-brand-sage/50 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent font-body resize-none"
              />

              <div className="flex items-center justify-between">
                <p className="text-sm text-brand-slate/70 font-body">
                  {inputText.length} characters • {inputText.split(' ').filter(w => w.length > 0).length} words
                </p>
                <button
                  onClick={handleSummarize}
                  disabled={!inputText.trim() || isProcessing}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5 mr-2" />
                      Generate Summary
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Processing State */}
          {isProcessing && (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-sage/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-brand-green animate-pulse" />
              </div>
              <h3 className="text-xl font-header font-semibold text-brand-navy mb-2">
                AI is analyzing your notes...
              </h3>
              <p className="text-brand-slate font-body">
                Extracting key concepts and generating a comprehensive summary
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Results Section */
        <div className="space-y-6">
          {/* Summary Result */}
          <div className="card p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand-green/20 rounded-xl flex items-center justify-center mr-4">
                  <Sparkles className="w-6 h-6 text-brand-green" />
                </div>
                <div>
                  <h2 className="text-xl font-header font-bold text-brand-navy">Summary Generated</h2>
                  <p className="text-brand-slate font-body">
                    Created {summaryResult.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={copyToClipboard}
                  className="btn-secondary"
                >
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button className="btn-primary">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            <div className="bg-brand-sage/10 rounded-xl p-6 mb-6">
              <h3 className="font-header font-semibold text-brand-navy mb-3">Summary</h3>
              <p className="text-brand-slate leading-relaxed font-body whitespace-pre-line">
                {summaryResult.summary}
              </p>
            </div>

            {summaryResult.keyPoints.length > 0 && (
              <div className="mb-6">
                <h3 className="font-header font-semibold text-brand-navy mb-4">Key Points</h3>
                <div className="space-y-3">
                  {summaryResult.keyPoints.map((point, index) => (
                    <div key={index} className="flex items-start space-x-3 p-4 bg-brand-light/50 rounded-lg">
                      <div className="w-6 h-6 bg-brand-green/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-brand-green text-sm font-semibold">{index + 1}</span>
                      </div>
                      <p className="text-brand-slate leading-relaxed font-body">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {summaryResult.concepts.length > 0 && (
              <div>
                <h3 className="font-header font-semibold text-brand-navy mb-4">Key Concepts</h3>
                <div className="flex flex-wrap gap-2">
                  {summaryResult.concepts.map((concept, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-brand-green/10 text-brand-green rounded-full text-sm font-body"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={reset}
              className="btn-secondary"
            >
              Summarize New Notes
            </button>
            <button className="btn-primary">
              Save to Study Materials
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteSummarizer;