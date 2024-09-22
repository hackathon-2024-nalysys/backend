import { Injectable } from '@nestjs/common';
import { GenerativeAi } from '../domain/GenerativeAi';
import { GoogleAuth } from 'google-auth-library';
import { VertexAI } from '@google-cloud/vertexai';
import { setTimeout } from 'timers/promises';

type EmbeddingResponse = {
  predictions: {
    embeddings: {
      statistics: {
        truncated: boolean;
        token_count: number;
      };
      values: number[];
    };
  }[];
};

@Injectable()
export class GenerativeAiImpl implements GenerativeAi {
  private auth = new GoogleAuth();
  private vertexai = new VertexAI({
    project: process.env.GOOGLE_PROJECT_ID,
    location: process.env.GOOGLE_REGION,
  });
  private model = this.vertexai.getGenerativeModel({
    model: 'gemini-1.5-flash',
  });
  private predictEndpoint = `https://${process.env.GOOGLE_REGION}-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_PROJECT_ID}/locations/${process.env.GOOGLE_REGION}/publishers/google/models/text-multilingual-embedding-002:predict`;

  async generateHobbyDescription(hobbyName: string): Promise<string> {
    // タイムアウト対策
    while (true) {
      try {
        const response = await this.model.generateContent({
          systemInstruction:
            '与えられた単語がどのような内容の趣味であるか100字程度で説明して下さい。ただし、客観的事実のみを述べ、主観的・感情的な表現への言及は避けて下さい。さらに、シノニムがあれば挙げて下さい。',
          contents: [{ role: 'user', parts: [{ text: hobbyName }] }],
        });
        return response.response.candidates?.[0].content.parts[0].text || '';
      } catch (e) {
        if (e instanceof Error && e.message.includes('RESOURCE_EXHAUSTED')) {
          await setTimeout(50000);
          continue;
        }
        throw e;
      }
    }
  }

  async generateEmbedding(content: string): Promise<number[]> {
    const token = await this.auth.getAccessToken();
    const response = await fetch(this.predictEndpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [
          {
            task_type: 'SEMANTIC_SIMILARITY',
            content,
          },
        ],
      }),
    });
    return (await response.json()).predictions[0].embeddings.values;
  }
}
