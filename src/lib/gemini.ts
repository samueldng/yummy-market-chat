
// Configuração da API do Gemini
export const GEMINI_CONFIG = {
  apiKey: '', // Será preenchida dinamicamente
  model: 'gemini-1.5-flash',
  endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
};

export interface GeminiResponse {
  intent: string;
  message: string;
  data?: any;
  suggestions?: string[];
}

export const processWithGemini = async (message: string, apiKey: string): Promise<GeminiResponse> => {
  const systemPrompt = `
    Você é um assistente de marketplace de comida brasileiro que ajuda clientes a fazer pedidos.
    
    Identifique a intenção do usuário e responda SEMPRE com JSON estruturado válido:
    {
      "intent": "descobrir_lojas | adicionar_item | remover_item | finalizar_pedido | consultar_status | saudacao",
      "message": "Resposta amigável e natural em português brasileiro",
      "data": { "storeType": "tipo_de_loja", "productName": "nome_do_produto", "quantity": 1 },
      "suggestions": ["sugestão 1", "sugestão 2", "sugestão 3"]
    }
    
    Intents disponíveis:
    - saudacao: quando o usuário cumprimenta ou inicia conversa
    - descobrir_lojas: quando quer encontrar lojas ou tipos de comida (pizzaria, açaiteria, etc)
    - adicionar_item: quando quer adicionar produtos específicos ao carrinho
    - remover_item: quando quer remover produtos do carrinho
    - finalizar_pedido: quando quer fechar/finalizar o pedido
    - consultar_status: quando quer saber status do pedido
    
    Seja natural, amigável e use linguagem brasileira. Sugira produtos e lojas populares.
    Sempre responda em JSON válido, sem texto adicional.
  `;

  try {
    const response = await fetch(`${GEMINI_CONFIG.endpoint}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\nUsuário: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          topP: 0.8,
          topK: 40,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // Limpar e fazer parse do JSON
    const cleanText = generatedText.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      return JSON.parse(cleanText);
    } catch (parseError) {
      console.warn('Erro ao fazer parse do JSON:', parseError);
      // Fallback se não for JSON válido
      return {
        intent: 'saudacao',
        message: generatedText || 'Olá! Como posso ajudar você hoje?',
        suggestions: ['Ver pizzarias', 'Buscar açaí', 'Ver promoções'],
      };
    }
  } catch (error) {
    console.error('Erro na API do Gemini:', error);
    
    // Melhor tratamento de erros específicos
    if (error instanceof Error && error.message.includes('503')) {
      throw new Error('O serviço do Gemini está temporariamente sobrecarregado. Tente novamente em alguns minutos.');
    }
    if (error instanceof Error && error.message.includes('401')) {
      throw new Error('Chave da API inválida. Verifique sua API key do Gemini.');
    }
    if (error instanceof Error && error.message.includes('400')) {
      throw new Error('Requisição inválida. Verifique os parâmetros enviados.');
    }
    
    throw error;
  }
};
