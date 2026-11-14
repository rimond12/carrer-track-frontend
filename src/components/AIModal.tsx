import React, { useState } from 'react';
import api from '../services/api';
import type { AIAnalysisResult } from '../types';
import { Sparkles, X, Brain, CheckCircle, HelpCircle, BookOpen, Loader2 } from 'lucide-react';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTitle?: string;
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, defaultTitle = '' }) => {
  const [jobTitle, setJobTitle] = useState(defaultTitle);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError('Please paste a job description text to analyze.');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await api.post('/ai/analyze-job', {
        jobTitle: jobTitle.trim(),
        jobDescription: jobDescription.trim(),
      });

      if (response.data.success && response.data.aiAnalysis) {
        setAnalysis(response.data.aiAnalysis);
      } else {
        setError('Could not generate AI analysis. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to connect to AI assistant.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border-2 border-indigo-600 dark:border-indigo-500 shadow-2xl overflow-hidden my-8 transition-colors">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-indigo-50/50 dark:bg-indigo-950/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                AI Job Assistant <span className="text-[10px] px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-300 dark:border-indigo-800">+5 Bonus Feature</span>
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Input Form */}
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Target Job Title (Optional)</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">Paste Job Description / Requirements</label>
              <textarea
                rows={4}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste full job posting text here to extract key requirements, technical skills, and 3 mock interview questions..."
                className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-indigo-600"
              />
            </div>

            {error && <p className="text-xs font-bold text-red-600 dark:text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={loading || !jobDescription.trim()}
              className="w-full flex items-center justify-center space-x-2 py-3 text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition shadow-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Job Requirements with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Insights & Interview Questions</span>
                </>
              )}
            </button>
          </form>

          {/* Analysis Results Display */}
          {analysis && (
            <div className="space-y-5 pt-4 border-t border-slate-200 dark:border-slate-800">
              
              {/* Executive Summary */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-400 text-xs font-extrabold uppercase tracking-wider">
                  <Brain className="w-4 h-4" />
                  <span>Role Summary</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">{analysis.summary}</p>
              </div>

              {/* Required Skills */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 text-xs font-extrabold uppercase tracking-wider">
                  <CheckCircle className="w-4 h-4" />
                  <span>Key Required Skills</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.requiredSkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 text-xs font-bold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preparation Topics */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-400 text-xs font-extrabold uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>Preparation Topics</span>
                </div>
                <ul className="space-y-1.5 pl-2">
                  {analysis.preparationTopics.map((topic, idx) => (
                    <li key={idx} className="text-xs text-slate-700 dark:text-slate-300 font-medium flex items-start space-x-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 3 Possible Interview Questions */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400 text-xs font-extrabold uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4" />
                  <span>3 Recommended Interview Questions</span>
                </div>
                <div className="space-y-2">
                  {analysis.interviewQuestions.map((q, idx) => (
                    <div key={idx} className="p-3 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-300 font-medium">
                      <span className="font-bold text-purple-700 dark:text-purple-400 mr-2">Q{idx + 1}:</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
