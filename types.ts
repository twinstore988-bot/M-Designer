
export interface Preset {
  id: string;
  name: string;
  icon: string;
  prompt: string;
  description: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  originalImage: string | null;
  editedImage: string | null;
  history: { original: string; edited: string }[];
}
