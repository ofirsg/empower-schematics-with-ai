import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { TemplateData, ToolOptions } from './common/tool-interfaces';
import { GeminiChatManager } from '../common/gemini-chat-manager';
import {
  extractElementsData,
  getComponentSpecFileTemplate,
  getExampleFilesText,
  getServiceSpecFileTemplate,
  getTemplateData,
} from './common/tool-helpers';
import {
  getAnalyzeImagePrompt,
  getExamplePrompt,
  getHtmlPrompt,
  getInitialInstructionsPrompt,
  getScssPrompt,
  getServicePrompt,
  getSpecFilePrompt,
  getTsPrompt,
  getUpdateElementsPrompt
} from './common/tool-prompts';
import { base64Encode, enhanceResultsWithAI, getChatHistoryFile } from '../common/common-utils';

const exampleImagePath = 'src/app/examples/ongoing-projects/ongoing-projects.png';

export function imageToComponentGenerator(options: ToolOptions): Rule {
  // options.imagePath = 'src/app/examples/ongoing-projects/ongoing-projects.png';
  // options.imageDescription = 'The image describe the component that will show the ongoing projects, including some basic details on each project';
  // options.pathToCreate = 'src/app/ongoing-projects';

  return async (tree: Tree, context: SchematicContext): Promise<void> => {
    // Schematics - Prepare data
    const templateData: TemplateData = getTemplateData(options.pathToCreate);
    const base64Image = base64Encode(tree.read(options.imagePath));

    // Generative AI - Create chat instance
    const geminiChat = new GeminiChatManager();

    // Generative AI - Initial chat message
    const initialInstructionsPrompt = getInitialInstructionsPrompt(templateData, options.imageDescription);
    await geminiChat.generateContent(initialInstructionsPrompt, base64Image);

    // Schematics - Provide example
    const exampleImage = base64Encode(tree.read(exampleImagePath));
    const exampleFilesText = getExampleFilesText(tree);

    // Generative AI - Update example
    const examplePrompt = getExamplePrompt(exampleFilesText);
    await geminiChat.generateContent(examplePrompt, exampleImage);

    // Generative AI - Generate elements tree
    const analyzeImagePrompt = getAnalyzeImagePrompt(templateData);
    const analyzeImageResultCode = await geminiChat.generateCode(analyzeImagePrompt, 'json');

    // Schematics - Extract elements tree from chat response
    const elementsData = extractElementsData(analyzeImageResultCode);

    // Generative AI - Update elements context
    const updateElementsPrompt = getUpdateElementsPrompt(templateData, elementsData);
    await geminiChat.generateContent(updateElementsPrompt);

    // Generative AI - Generate service file
    const serviceFilePrompt = getServicePrompt(templateData);
    const serviceFile = await geminiChat.generateCode(serviceFilePrompt, 'typescript');

    // Schematics - Generate service spec file template
    const serviceSpecFileTemplate = getServiceSpecFileTemplate(templateData);

    // Generative AI - Generate service spec file
    const serviceSpecFilePrompt = getSpecFilePrompt(templateData.servicePath, serviceFile, serviceSpecFileTemplate);
    const serviceSpecFile = await geminiChat.generateCode(serviceSpecFilePrompt, 'typescript');

    // Generative AI - Generate component files
    const scssFilePrompt = getScssPrompt(templateData);
    const scssFile = await geminiChat.generateCode(scssFilePrompt, 'scss');
    const htmlFilePrompt = getHtmlPrompt(templateData, scssFile);
    const htmlFile = await geminiChat.generateCode(htmlFilePrompt, 'html');
    const tsFilePrompt = getTsPrompt(templateData, htmlFile, scssFile, serviceFile);
    const tsFile = await geminiChat.generateCode(tsFilePrompt, 'typescript');

    // Schematics - Create component spec file template
    const specFileTemplate = getComponentSpecFileTemplate(templateData);

    // Generative AI - Generate service spec file
    const specFilePrompt = getSpecFilePrompt(templateData.componentPath, tsFile, specFileTemplate, htmlFile);
    const specFile = await geminiChat.generateCode(specFilePrompt, 'typescript');

    // Generative AI - Enhance results
    const filesToCreate = await enhanceResultsWithAI(geminiChat, {
      [`${templateData.servicePath}.ts`]: serviceFile,
      [`${templateData.servicePath}.spec.ts`]: serviceSpecFile,
      [`${templateData.componentPath}.scss`]: scssFile,
      [`${templateData.componentPath}.html`]: htmlFile,
      [`${templateData.componentPath}.ts`]: tsFile,
      [`${templateData.componentPath}.spec.ts`]: specFile,
    });

    // Schematics - Create files
    Object.keys(filesToCreate).forEach(filePath => {
      tree.create(filePath, filesToCreate[filePath]);
    });

    // Schematics - Save chat history
    const chatHistory = await geminiChat.getChatHistory();
    const chatHistoryFile = await getChatHistoryFile(chatHistory);
    tree.create(`${templateData.componentPath}.chat-history.html`, chatHistoryFile);
  };
}
