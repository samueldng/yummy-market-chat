
import { createClient } from '@supabase/supabase-js';

// Configuração temporária - será substituída pela integração nativa do Lovable
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
