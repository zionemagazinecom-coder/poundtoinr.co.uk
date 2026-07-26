import { isSupabaseConfigured, supabase } from './supabaseClient';

const mediaBucket = 'media';

export type MediaUploadResult = {
  message: string;
  storage: 'supabase' | 'local';
  url: string;
};

export async function uploadMediaFile(file: File): Promise<MediaUploadResult> {
  if (isSupabaseConfigured && supabase) {
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const safeName = file.name
      .replace(/\.[^.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const path = `articles/${Date.now()}-${safeName || 'image'}.${extension}`;

    const { error } = await supabase.storage.from(mediaBucket).upload(path, file, {
      cacheControl: '31536000',
      upsert: false,
    });

    if (!error) {
      const { data } = supabase.storage.from(mediaBucket).getPublicUrl(path);
      return { message: 'Image Supabase Storage mein upload ho gayi.', storage: 'supabase', url: data.publicUrl };
    }
  }

  return {
    message: 'Image local preview mein add ho gayi. Supabase Storage set hone ke baad public URL banega.',
    storage: 'local',
    url: await readFileAsDataUrl(file),
  };
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
