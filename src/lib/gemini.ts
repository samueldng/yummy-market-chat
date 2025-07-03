
// Configuração da API do Gemini
export const GEMINI_CONFIG = {
  apiKey: process.env.GEMINI_API_KEY || '',
  model: 'gemini-pro',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
};

export interface GeminiResponse {
  intent: string;
  message: string;
  data?: any;
  suggestions?: string[];
}

export const processWithGemini = async (message: string): Promise<GeminiResponse> => {
  const systemPrompt = `
    Você é um assistente de marketplace de comida que ajuda clientes a fazer pedidos.
    
    Identifique a intenção do usuário e responda com JSON estruturado:
    {
      "intent": "descobrir_lojas | adicionar_item | remover_item | finalizar_pedido | consultar_status",
      "message": "Resposta amigável para o usuário",
      "data": { dados relevantes },
      "suggestions": ["sugestão 1", "sugestão 2", "sugestão 3"]
    }
    
    Intents disponíveis:
    - descobrir_lojas: quando o usuário quer encontrar lojas ou tipos de comida
    - adicionar_item: quando quer adicionar produtos ao carrinho
    - remover_item: quando quer remover produtos
    - finalizar_pedido: quando quer fechar o pedido
    - consultar_status: quando quer saber status do pedido
    
    Seja natural e amigável. Sugira produtos e lojas relevantes.
  `;

  try {
    const response = await fetch(GEMINI_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_CONFIG.apiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `Usuário: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        },
      }),
    });

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Tentar fazer parse do JSON
    try {
      return JSON.parse(generatedText);
    } catch {
      // Fallback se não for JSON válido
      return {
        intent: 'descobrir_lojas',
        message: generatedText,
        suggestions: ['Ver lojas', 'Buscar produtos', 'Ver carrinho'],
      };
    }
  } catch (error) {
    console.error('Erro na API do Gemini:', error);
    throw error;
  }
};
