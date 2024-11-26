export interface ToolOptions {
  imagePath: string;
  pathToCreate: string;
  imageDescription: string;
}

export enum ElementType {
  button = 'button',
  iconButton = 'iconButton',
  textButton = 'textButton',
  container = 'container',
  link = 'link',
  text = 'text',
  boldText = 'boldText',
  title = 'title',
  unknown = 'unknown',
  card = 'card',
}

export interface ElementData {
  name: string;
  type: ElementType;
  children: ElementData[];
}

export interface ProjectElementData {
  type: ElementType;
  elementToUse: string;
  importModule?: string;
  linkToDocs?: string;
  generateInstructions?: string;
}

export interface ElementsData {
  elementsTree: ElementData;
  projectElements: ProjectElementData[];
}

export interface TemplateData {
  selector: string;
  fileName: string;
  componentName: string;
  componentPath: string;
  serviceName: string;
  servicePath: string;
}
