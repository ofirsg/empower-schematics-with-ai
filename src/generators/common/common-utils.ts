import { Content } from '@google/generative-ai';
import { GeminiChatManager } from './gemini-chat-manager';
import { inquirerPromptConfirmation, inquirerPromptList, inquirerPromptText } from './inquirer-utils';

export async function enhanceResultsWithAI(chat: GeminiChatManager, filesToCreate: { [filePath: string]: string }): Promise<{ [filePath: string]: string }> {
  const filesResult = { ...filesToCreate };

  let shouldFixResult = true;

  while (shouldFixResult) {
    shouldFixResult = await inquirerPromptConfirmation('Should enhance the result? (y/n)');

    if (shouldFixResult) {
      const fileToEnhance = await inquirerPromptList('Select a file to enhance', Object.keys(filesResult));

      if (fileToEnhance) {
        const fixPrompt = await inquirerPromptText(`Please insert the prompt to enhance ${fileToEnhance}`);

        if (fixPrompt) {
          const codeType = fileToEnhance.split('.').pop() ?? '';
          const enhanceFilePrompt = getEnhanceFilePrompt(fixPrompt, fileToEnhance, filesResult[fileToEnhance], codeType);
          const newFileContent = await chat.generateCode(enhanceFilePrompt, codeType);

          if (newFileContent) {
            const shouldUpdateFile = await inquirerPromptConfirmation(`Should update ${fileToEnhance}? (y/n)`);

            if (shouldUpdateFile) {
              filesResult[fileToEnhance] = newFileContent;
            }
          }
        }
      }
    }
  }

  return filesResult;
}

function getEnhanceFilePrompt(prompt: string, filePath: string, fileContent: string, codeType: string): string {
  return `I want to make some changes to the \`${filePath}\` file.

  **Current File Content:**

  \`\`\`${codeType}
  ${fileContent}
  \`\`\`

  **Instructions:**

  ${prompt}

  **Deliverable:**

  Provide the entire updated code for the file, applying the changes requested in the instructions.
  `;
}

export function base64Encode(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function treeToFlatArray<T extends { children: T[] }>(tree: T): T[] {
  const allItems: T[] = [tree];

  if (tree.children?.length > 0) {
    tree.children.forEach(child => {
      const childItems = child ? treeToFlatArray(child) : [];
      allItems.push(...(childItems ?? []));
    });
  }

  return allItems;
}

export async function getChatHistoryFile(chatHistory: Content[]): Promise<string> {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>Chat History</title>
      <style>
        body {
          font-family: sans-serif;
        }
        .message {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          margin-left: 8px;
          margin-right: 8px;
        }
        .message-part {
          white-space: pre-wrap;
        }
        .code-section {
          white-space: pre-wrap;
          font-family: monospace;
          display: block;
          padding: 10px;
          margin-top: 5px;
        }
        .user {
          background-color: #eee;
        }
        .assistant {
          background-color: #f9f9f9;
        }
      </style>
    </head>
    <body>
      <h1>Chat History</h1>
      ${chatHistory.map(message => {
    const roleClass = message.role === 'user' ? 'user' : 'assistant';
    const content = message.parts.map(part => {
      let escapedText = '';

      if (part.text) {
        escapedText = part.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

        const codeBlocks = escapedText.match(/```[\s\S]*?```/g);
        if (codeBlocks) {
          codeBlocks.forEach(block => {
            const code = block.substring(3, block.length - 3).trim();
            escapedText = escapedText.replace(block, `<code class="code-section">${code}</code>`);
          });
        }
      }

      return escapedText;
    }).join('<br>');

    return `
          <div class="message ${roleClass}">
            <p><strong>${message.role}:</strong></p>
            <p class="message-part">${content}</p>
          </div>
        `;
  }).join('')}
    </body>
    </html>
  `;
}
