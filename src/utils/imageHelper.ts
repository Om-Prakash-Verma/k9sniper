
/**
 * Helper to construct image URLs.
 * If the input is a full URL (starts with http/https), it returns it as is.
 * Otherwise, it prepends the base URL.
 */
export const getImageUrl = (imageName: string | undefined): string => {
  if (!imageName) return 'https://picsum.photos/seed/pet/800/600';
  
  if (imageName.startsWith('http://') || imageName.startsWith('https://') || imageName.startsWith('data:')) {
    return imageName;
  }

  // Default base URL - can be adjusted as needed
  // If the user wants domain.com/image-name, we use '/'
  const baseUrl = '/'; 

  return `${baseUrl}${imageName}`;
};
