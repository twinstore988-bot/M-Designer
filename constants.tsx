
import { Preset } from './types';

export const PRESETS: Preset[] = [
  {
    id: 'studio-luxury',
    name: 'أستوديو فاخر',
    icon: '✨',
    description: 'إضاءة سينمائية ناعمة مع خلفية رمادية متدرجة واحترافية.',
    prompt: 'Place this product in a luxury professional photography studio with soft cinematic lighting, elegant dramatic shadows, high-end gray gradient background, 8k resolution, minimalist setup.'
  },
  {
    id: 'nature-lifestyle',
    name: 'طبيعي / خارجي',
    icon: '🌿',
    description: 'وضع المنتج في بيئة طبيعية مشمسة (حديقة أو غابة).',
    prompt: 'Place this product on a rustic wooden table in a sun-drenched garden with lush greenery and beautiful bokeh in the background, natural morning sunlight, high quality lifestyle photography.'
  },
  {
    id: 'minimal-white',
    name: 'أبيض بسيط',
    icon: '🤍',
    description: 'خلفية بيضاء تماماً مناسبة للمتاجر الإلكترونية العالمية.',
    prompt: 'Clean high-key product photography on a pure white background with soft professional shadows, ultra-sharp focus, commercial style, suitable for high-end e-commerce.'
  },
  {
    id: 'marble-elegant',
    name: 'رخام ملكي',
    icon: '🏛️',
    description: 'وضع المنتج على سطح رخامي فخم مع إضاءة ذهبية.',
    prompt: 'The product is placed on a luxurious white marble surface with gold accents, soft warm ambient lighting, upscale interior background, reflections on the marble, high-end brand aesthetic.'
  },
  {
    id: 'beach-summer',
    name: 'شاطئ صيفي',
    icon: '🏖️',
    description: 'أجواء صيفية مشمسة على رمال الشاطئ.',
    prompt: 'Place the product on fine white beach sand with sea shells, ocean waves blurred in the background, bright summer sunlight, tropical vacation vibes.'
  },
  {
    id: 'cyberpunk-neon',
    name: 'سايبر بانك',
    icon: '🌌',
    description: 'إضاءة نيون قوية وأجواء مستقبلية.',
    prompt: 'The product in a futuristic cyberpunk setting with vibrant pink and blue neon lights, wet asphalt reflections, dark urban atmosphere, blade runner style.'
  }
];
