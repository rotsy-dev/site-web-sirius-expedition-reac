
// src/utils/uploadImage.ts

const IMGBB_API_KEY = '1c491461cfe54111ef926d0be774a47b'; // Remplace par ta vraie clé ImgBB

export const uploadImageToImgBB = async (file: File): Promise<string> => {
  if (!file) {
    throw new Error('Aucun fichier sélectionné');
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    console.log('Upload de l\'image en cours...');
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Erreur lors de l\'upload');
    }

    const data = await response.json();

    if (data.success) {
      console.log('Upload réussi ! URL :', data.data.url);
      return data.data.url; // C'est l'URL directe de l'image (publique)
    } else {
      throw new Error('Upload échoué');
    }
  } catch (error) {
    console.error('Erreur upload ImgBB :', error);
    throw error;
  }
};