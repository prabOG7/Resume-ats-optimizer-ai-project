import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const ResumeAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type === 'application/msword' || selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setFile(selectedFile);
    } else {
      alert('Please upload a PDF or Word document');
    }
  };

  const handleSubmit = async () => {
    if (!file || !jobDescription) {
      alert('Please upload a resume and enter job description');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jobDescription);

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error analyzing resume:', error);
      alert('Error analyzing resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* File Upload Section */}
      <div className="border-2 border-dashed rounded-lg p-6">
        <div className="flex flex-col items-center">
          <Upload className="h-12 w-12 text-gray-400" />
          <label className="mt-4 cursor-pointer">
            {file ? (
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>{file.name}</span>
              </div>
            ) : (
              <span className="text-blue-500">Upload Resume (PDF/Word)</span>
            )}
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      {/* Job Description Input */}
      <div className="space-y-2">
        <label className="block font-medium">
          Job Description
        </label>
        <textarea
          className="w-full h-32 p-2 border rounded-md"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Analyzing...' : 'Analyze Resume'}
      </button>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-4 mt-8 p-4 border rounded-lg">
          <h2 className="text-xl font-bold">Analysis Results</h2>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span>Match Score</span>
              <span className="font-bold">{analysis.match_score}%</span>
            </div>
            
            {analysis.keywords_found?.map((keyword, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{keyword}</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            ))}
            
            {analysis.missing_keywords?.map((keyword, index) => (
              <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>{keyword}</span>
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="font-bold">Suggestions</h3>
            <ul className="list-disc pl-5 mt-2">
              {analysis.suggestions?.map((suggestion, index) => (
                <li key={index} className="mt-1">{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzer;