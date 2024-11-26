import { ElementType, ProjectElementData } from './tool-interfaces';

export const projectElementsData: { [key: string]: ProjectElementData } = {
  [ElementType.button]: {
    type: ElementType.button,
    elementToUse: 'button',
    importModule: 'MatButtonModule',
    linkToDocs: 'https://material.angular.io/components/button/overview',
    generateInstructions: 'Generate a `<button mat-raised-button>` element. See the documentation for more options: https://material.angular.io/components/button/overview. Add an output event emitter to handle button clicks.',
  },
  [ElementType.iconButton]: {
    type: ElementType.iconButton,
    elementToUse: 'button',
    importModule: 'MatButtonModule',
    linkToDocs: 'https://material.angular.io/components/button/overview',
    generateInstructions: 'Generate a `<button mat-icon-button>` element with an icon inside. See the documentation for more options: https://material.angular.io/components/button/overview. Add an output event emitter to handle button clicks.',
  },
  [ElementType.textButton]: {
    type: ElementType.textButton,
    elementToUse: 'button',
    importModule: 'MatButtonModule',
    linkToDocs: 'https://material.angular.io/components/button/overview',
    generateInstructions: 'Generate a `<button mat-button>` element. See the documentation for more options: https://material.angular.io/components/button/overview. Add an output event emitter to handle button clicks.',
  },
  [ElementType.container]: {
    type: ElementType.container,
    elementToUse: 'div',
    generateInstructions: 'Generate a `<div>` element to act as a container for other elements.',
  },
  [ElementType.link]: {
    type: ElementType.link,
    elementToUse: 'a',
    generateInstructions: 'Generate an `<a>` element with the `href` attribute set to "#". Remember to update the `href` with the actual link.',
  },
  [ElementType.text]: {
    type: ElementType.text,
    elementToUse: 'div',
    generateInstructions: 'Generate a `<div>` element to display text content. Consider using a more specific tag if the content has a clear semantic meaning (e.g., `<p>`, `<h1>`, etc.).',
  },
  [ElementType.boldText]: {
    type: ElementType.boldText,
    elementToUse: 'strong',
    generateInstructions: 'Generate a `<strong>` element to display bold text content.',
  },
  [ElementType.title]: {
    type: ElementType.title,
    elementToUse: 'h2',
    generateInstructions: 'Generate an `<h2>` element to display a title. Consider using a different heading level (`<h1>`, `<h3>`, etc.) based on the hierarchy and importance of the title.',
  },
  [ElementType.card]: {
    type: ElementType.card,
    elementToUse: 'mat-card',
    importModule: 'MatCardModule',
    linkToDocs: 'https://material.angular.io/components/card/overview',
    generateInstructions: 'Generate a `<mat-card>` element. See the documentation for more options and content guidelines: https://material.angular.io/components/card/overview.',
  },
  [ElementType.unknown]: {
    type: ElementType.unknown,
    elementToUse: 'div',
    generateInstructions: 'Generate a `<div>` element as a placeholder. Review and update this element based on the actual content.',
  },
};
