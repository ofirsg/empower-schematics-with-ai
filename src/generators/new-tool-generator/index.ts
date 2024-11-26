import { strings } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { enhanceResultsWithAI, getChatHistoryFile } from '../common/common-utils';
import { GeminiChatManager } from '../common/gemini-chat-manager';
import { ToolOptions } from './tool-interfaces';
import { getSchemaJsonFileTemplate } from './templates/schema.template';
import { getIndexTsPromptTemplate } from './templates/index.prompt.template';

export function newToolGenerator(options: ToolOptions): Rule {
  return async (tree: Tree, _context: SchematicContext): Promise<void> => {
    console.log(`Start creating the new tool ${options.name}`);

    const toolPath = `src/generators/${strings.dasherize(options.name)}`
    const toolFolderName = strings.dasherize(options.name);
    const geminiChat = new GeminiChatManager();

    const schemaFile = getSchemaJsonFileTemplate(options);
    console.log('############################ schema.json');
    console.log(schemaFile);
    console.log('########################################################');

    const interfaceFile = 'export interface ToolOptions {}';
    console.log('############################ tool-interfaces.ts');
    console.log(schemaFile);
    console.log('########################################################');

    const indexFile = await createIndexFile(options, tree, geminiChat);

    updateCollectionJson(options, tree, toolFolderName);
    updatePackageJson(options, tree, toolFolderName);

    const filesToCreate = await enhanceResultsWithAI(geminiChat, {
      [`${toolPath}/schema.json`]: schemaFile,
      [`${toolPath}/tool-interfaces.ts`]: interfaceFile,
      [`${toolPath}/index.ts`]: indexFile,
    });

    Object.keys(filesToCreate).forEach(filePath => {
      tree.create(filePath, filesToCreate[filePath]);
    });

    const chatHistory = await geminiChat.getChatHistory();
    const chatHistoryFile = await getChatHistoryFile(chatHistory);
    tree.create(`${toolPath}/chat-history.html`, chatHistoryFile);

    console.log(`Completed`);
  };
}

export async function createIndexFile(options: ToolOptions, tree: Tree, geminiChat: GeminiChatManager): Promise<string> {
  const exampleTool = tree.read('src/generators/new-tool-generator/index.ts').toString();
  const generateIndexPrompt = getIndexTsPromptTemplate(options, exampleTool);

  return geminiChat.generateCode(generateIndexPrompt, 'typescript');
}

export function updateCollectionJson(options: ToolOptions, tree: Tree, toolFolderName: string): void {
  const collectionJson = tree.readJson('src/generators/collection.json');
  if (collectionJson) {
    collectionJson['schematics'][toolFolderName] = {
      'description': options.description,
      'factory': `./${toolFolderName}/index#${strings.camelize(options.name)}`,
      'schema': `./${toolFolderName}/schema.json`
    };
    tree.overwrite('src/generators/collection.json', JSON.stringify(collectionJson, null, 2));
  }
}

export function updatePackageJson(options: ToolOptions, tree: Tree, toolFolderName: string): void {
  const packageJson = tree.readJson('package.json');
  if (packageJson) {
    packageJson['scripts'][toolFolderName] = `npm run build-schematics && schematics .:${toolFolderName} --dry-run=false`;
    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));
  }
}
