import { ChatSession, Content, GoogleGenerativeAI, InlineDataPart } from '@google/generative-ai';
import { environment } from '../environment/environment';

const genAI = new GoogleGenerativeAI(environment.geminiApiKey);
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-001',
});

export class GeminiChatManager {
  private chat: ChatSession;

  constructor() {
    this.chat = model.startChat();
  }

  async generateContent(prompt: string, imageBase64?: string): Promise<string> {
    const image: InlineDataPart | null = imageBase64 ? {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/png',
      },
    } : null;

    console.log('*********************************************');
    console.log('Sending request to Gemini:');
    console.log(prompt.split('\n')[0]);
    console.log('...');
    console.log('');
    console.log('Gemini response:');

    let result: string = '';

    try {
      const resultStream = await this.chat.sendMessageStream(image ? [prompt, image] : prompt);

      for await (const chunk of resultStream.stream) {
        const chunkText = chunk.text();
        console.log(chunkText);
        result += chunkText;
      }
    } catch (err) {
      console.error('Error generating content with Gemini:', err);
      result = '';
    }

    console.log('');
    console.log('*********************************************');

    return result;
  }

  async getChatHistory(): Promise<Content[]> {
    return this.chat.getHistory();
  }

  private extractCode(result: string, codeType: string): string {
    let codeResult = result ?? '';
    const startTag = '```' + codeType;
    const endTag = '```';
    let startIndex = result.indexOf(startTag) + startTag.length;

    if (startIndex < 0) {
      startIndex = result.indexOf(endTag) + endTag.length;
    }

    if (startIndex >= 0) {
      const endIndex = result.indexOf(endTag, startIndex);

      if (endIndex > startIndex) {
        codeResult = result.substring(startIndex, endIndex).trim();
      }
    }

    return codeResult;
  }

  async generateCode(prompt: string, codeType: string): Promise<string> {
    const result = await this.generateContent(prompt);

    return this.extractCode(result, codeType);
  }
}
