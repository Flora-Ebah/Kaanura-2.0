import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
    cloud: {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }
});

export const uploadImage = async (file) => {
    if (!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || !import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET) {
        throw new Error('Configuration Cloudinary manquante');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'naturelle_products');

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData
            }
        );
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Erreur lors de l\'upload de l\'image');
        }
        
        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
        throw new Error(
            error.message || 'Erreur lors de l\'upload de l\'image. Veuillez réessayer.'
        );
    }
};

export default cld; 