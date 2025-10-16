import React, { useState, useCallback } from 'react';
import { Upload, FileText, File, X, Sparkles, CheckCircle } from 'lucide-react';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectName: string;
  subjectId: string;
  onUploadComplete: (files: File[]) => void;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  subjectName,
  subjectId,
  onUploadComplete
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

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

  const handleUpload = async () => {
    if (uploadedFiles.length === 0) return;

    setProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    setProcessing(false);
    setSuccess(true);

    onUploadComplete(uploadedFiles);

    setTimeout(() => {
      setSuccess(false);
      setUploadedFiles([]);
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    if (!processing) {
      setUploadedFiles([]);
      setSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-brand-sage/20 px-8 py-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-header font-bold text-brand-navy">Upload Materials</h2>
            <p className="text-brand-slate font-body mt-1">Add study materials to {subjectName}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={processing}
            className="text-brand-slate/60 hover:text-brand-slate transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-8 py-6 space-y-6">
          {!success ? (
            <>
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
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
                  <div className="w-16 h-16 bg-brand-sage/20 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-brand-green" />
                  </div>

                  <div>
                    <p className="text-lg font-medium text-brand-navy mb-2 font-body">
                      Drop files here or click to browse
                    </p>
                    <p className="text-brand-slate/70 font-body text-sm">
                      Supported: PDF, DOCX, TXT, Images (JPG, PNG)
                    </p>
                    <p className="text-brand-slate/70 font-body text-xs mt-1">
                      Maximum file size: 50MB per file
                    </p>
                  </div>

                  <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload-modal"
                    accept=".pdf,.jpg,.jpeg,.png,.txt,.docx,.doc"
                  />
                  <label
                    htmlFor="file-upload-modal"
                    className="btn-primary cursor-pointer inline-flex items-center"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    Choose Files
                  </label>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-header font-semibold text-brand-navy mb-3">
                    Selected Files ({uploadedFiles.length})
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-brand-light/50 rounded-lg hover:bg-brand-light transition-colors"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <File className="w-5 h-5 text-brand-slate/70 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-brand-navy font-body truncate">
                              {file.name}
                            </p>
                            <p className="text-sm text-brand-slate/70 font-body">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          disabled={processing}
                          className="text-brand-slate/50 hover:text-red-500 transition-colors ml-2 disabled:opacity-50"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-brand-sage/10 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Sparkles className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-brand-slate font-body">
                    <p className="font-medium text-brand-navy mb-1">AI Processing</p>
                    <p>
                      Your files will be processed by AI to extract key concepts, generate summaries,
                      create flashcards, and organize study materials automatically.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleUpload}
                  disabled={uploadedFiles.length === 0 || processing}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Upload & Process
                    </>
                  )}
                </button>
                <button
                  onClick={handleClose}
                  disabled={processing}
                  className="btn-secondary disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-header font-bold text-brand-navy mb-2">
                Upload Successful!
              </h3>
              <p className="text-brand-slate font-body">
                Your materials are being processed and will be available shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
