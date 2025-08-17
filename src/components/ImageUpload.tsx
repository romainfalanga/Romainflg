import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Crop } from 'lucide-react';
import { storage, auth } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  onCancel: () => void;
}

export function ImageUpload({ currentImage, onImageChange, onCancel }: ImageUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      alert('L\'image ne doit pas dépasser 5MB');
      return;
    }

    setSelectedFile(file);
    
    // Créer une preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const compressImage = (file: File, maxWidth: number = 400, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();
      
      img.onload = () => {
        // Calculer les nouvelles dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        
        // Dessiner l'image redimensionnée
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convertir en base64 compressé
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      console.log('🔄 Compression de l\'image...');
      
      // Compresser l'image avant de la sauvegarder
      const compressedImage = await compressImage(selectedFile, 300, 0.7);
      
      console.log('✅ Image compressée, taille:', Math.round(compressedImage.length / 1024), 'KB');
      
      onImageChange(compressedImage);
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload:', error);
      alert(`❌ Erreur lors de l'upload : ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
      
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-900">
            Changer la photo de profil
          </h3>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!selectedFile ? (
            <>
              {/* Current Image */}
              {currentImage && (
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto mb-3 rounded-full overflow-hidden border-4 border-gray-200">
                    <img
                      src={currentImage}
                      alt="Photo actuelle"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-600">Photo actuelle</p>
                </div>
              )}

              {/* Upload Zone */}
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                  dragOver
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Sélectionner une image
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  Glissez-déposez une image ou cliquez pour parcourir
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF jusqu'à 5MB
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(file);
                }}
                className="hidden"
              />
            </>
          ) : (
            <>
              {/* Preview */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary-200 shadow-lg">
                  <img
                    src={previewUrl}
                    alt="Aperçu"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">Aperçu de votre nouvelle photo</p>
                <p className="text-xs text-gray-500">
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl('');
                  }}
                  className="flex-1 btn-secondary text-sm"
                  disabled={uploading}
                >
                  Changer
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="flex-1 btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Upload...
                    </>
                  ) : (
                    <>
                      <Check size={16} className="mr-2" />
                      Confirmer
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}