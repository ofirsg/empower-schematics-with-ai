import { ElementsData, TemplateData } from './tool-interfaces';

export function getInitialInstructionsPrompt(templateData: TemplateData, imageDescription: string): string {
  return `I want to create a new Angular component, based on the attached png, with a service to fetch and manage the component data.

  **Component & Service Data:**
  Here's some information about the component & service I want to create:

  * **Component Selector:** ${templateData.selector}
  * **Component name:** ${templateData.componentName}
  * **Component path:** ${templateData.componentPath}
  * **Service name:** ${templateData.serviceName}
  * **Service path:** ${templateData.servicePath}

  **Image Description:**
  ${imageDescription}

  **Service Guidelines:**
  1. The service should use HttpClient to fetch and update the data. It should create all the necessary methods to support the component and add the needed API calls.
  2. **Types:** Create any necessary interfaces or enums in the service's TS file and use them in the component's logic.
  3. **Return Data Type:** The service's methods should return Angular signals that use the created types.
  4. **Mock Data:** It should create a const with mock data that can be used to return data without the API calls.

  **Component Guidelines:**
  1. **Angular Material:** Use Angular Material (\`"@angular/material": "^18.2.4"\`) whenever possible. This includes using Material components in the HTML, Material colors and theming in the SCSS, and importing necessary Material modules in the TS file.
     For example, if you use \`mat-icon\`, add \`MatIconModule\` from \`@angular/material/icon\` to the component's \`imports\` array.
     Here's the link for Angular Material components: "https://material.angular.io/components/categories"
  2. **Standalone Component:** The generated component should be standalone.
  3. **Dynamic Data:** The component's data should be dynamic. Don't hardcode text for descriptions, counters, or other properties. Use static text only for call-to-actions (like buttons) and elements that are part of the component's fixed layout.
  4. **Angular Signals:** Use Angular signals for data management (updating and fetching data). Define and initialize signals in the TS file and use them in the HTML file. For more information on Angular signals, refer to the documentation: https://angular.dev/guide/signals
  5. **Call to Actions:** For buttons and other call-to-actions, define the corresponding methods in the TS file and trigger them from the HTML using the appropriate output events (e.g., \`(click)\` for buttons, \`(change)\` for input elements).
  6. **Visual Fidelity:** The generated component should closely resemble the attached image, taking into account the layout, positions, sizes, margins, padding, and overall visual style.

  **Instructions:**

  In the next messages, I will provide an example of the generated output with an input image. After that, I will send instructions on how to extract the elements from the image. This information will be used later to build the HTML, SCSS, and TS files for the component and the service.

  After that, I will send you instructions for creating each of the files:
  1. The service file (\`${templateData.fileName}.service.ts\`)
  2. The service spec file (\`${templateData.fileName}.service.spec.ts\`)
  3. The component SCSS file (\`${templateData.fileName}.component.scss\`)
  4. The component HTML file (\`${templateData.fileName}.component.html\`)
  5. The component TypeScript file (\`${templateData.fileName}.component.ts\`)
  6. The component spec file (\`${templateData.fileName}.component.spec.ts\`)

  Please create each file based on the data and instructions I provide, including the attached image. Each file should also consider the previous files:
    * The HTML file should use the classes and IDs defined in the SCSS file.
    * The component TypeScript file should consider both the HTML and SCSS, use the created service to fetch and manage the data, and provide all the necessary code to support them.
  `;
}

export function getExamplePrompt(exampleFilesText: string): string {
  return `The attached image is an example of a possible input image. For this image, the generated output files should be similar to this:

  ${exampleFilesText}

  This is an example of how the files should look for a specific input. Use it as a reference when creating the component and service files for the input image from the first message.
  `;
}

export function getAnalyzeImagePrompt(templateData: TemplateData): string {
  return `To create the component ${templateData.componentName}, I need you to extract the list of elements from the image that was sent in the first message.

  Based on the image, create a JSON object that describes the component structure. The structure should have a root element (root: ElementData) with its children.

  \`\`\`typescript
  interface ElementData {
    name: string;
    type: ElementType;
    children: ElementData[];
  }

  enum ElementType {
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
  \`\`\`

  Use this structure to describe the root element and all the elements in the PNG image.

  **Example:**

  If the image shows a div with a heading and a paragraph inside, the JSON output should be:

  \`\`\`json
  {
    "name": "root",
    "type": "div",
    "children": [
      {
        "name": "heading",
        "type": "h1",
        "children": []
      },
      {
        "name": "paragraph",
        "type": "p",
        "children": []
      }
    ]
  }
  \`\`\`

  **Important:**

  *   \`name\`: Use a descriptive name for the element (e.g., 'container', 'title', 'button').
  *   \`type\`: Use the correct \`ElementType\` for each element (from the enum above).
  *   \`children\`: If an element has no children, provide an empty array: \`[]\`.

  Provide only the JSON output.
  `;
}

export function getUpdateElementsPrompt(templateData: TemplateData, elementsData: ElementsData): string {
  return `Here is the data extracted from the image, which will be used to generate the Angular component ${templateData.componentName}:

  **Elements Data:**
  This JSON object describes the structure and hierarchy of the elements in the image:

  \`\`\`json
  ${JSON.stringify(elementsData.elementsTree, null, 2)}
  \`\`\`

  \`\`\`typescript
  interface ElementData {
    name: string;
    type: ElementType;
    children: ElementData[];
  }
  \`\`\`

  **Project Elements Data:**
  This provides information on how to generate each element type in the component:

  \`\`\`json
  ${JSON.stringify(elementsData.projectElements, null, 2)}
  \`\`\`

  \`\`\`typescript
  interface ProjectElementData {
    type: ElementType;
    elementToUse: string;
    importModule?: string;
    linkToDocs?: string;
    generateInstructions?: string;
  }
  \`\`\`
  `;
}

export function getServicePrompt(templateData: TemplateData): string {
  return `Let's start by creating the service file ('${templateData.serviceName}').

  This service will be responsible for fetching and managing the data for the component. It should expose public methods for any actions that require server calls, such as:

  * Fetching the initial data to display in the component.
  * Updating the data based on user interactions.
  * Removing data when necessary.

  **Instructions:**

  1. **API Calls:** Use Angular's HttpClient to make API calls for fetching and updating data. Create all the necessary methods to support the component's functionality and include the required API calls.
  2. **Types:** Define any necessary interfaces or enums in the service's TS file to represent the data structures. Use these types in the service's methods and the component's logic.
  3. **Return Data Type:** The service's methods should return Angular signals that hold the data. These signals should use the types defined in the service.
  4. **Mock Data:** Create a constant with mock data that can be used for development and testing purposes, allowing the component to function without actual API calls.
  5. **Injectable:** The service should be injectable and provided in the component.

  **Example Code Structure:**

  \`\`\`typescript
  import { Injectable } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import { signal } from '@angular/core';

  @Injectable({})
  export class ${templateData.serviceName} {
    // Example signal
    private _items = signal<Item[]>([]); // Replace 'Item' with the actual type
    public items = this._items.asReadonly();

    constructor(private http: HttpClient) {}

    // Example method to fetch data
    public fetchItems() {
      // ... API call using 'this.http.get(...)' ...
      // ... update the '_items' signal with the fetched data ...
    }

    // ... other methods for updating and removing data ...
  }
  \`\`\`
  `;
}

export function getScssPrompt(templateData: TemplateData): string {
  return `Now let's move on to the component files. First, let's create the component SCSS file ('${templateData.fileName}.component.scss').

  This SCSS file should define the styles that give the component the same look and feel as the image from the first message.

  **Instructions:**

  *   **Meaningful Class Names:** Use the \`name\` property from the elements data to create meaningful class names (e.g., \`.recipe-title\`, \`.ingredient-list\`, \`.save-button\`).
  *   **Project Elements Data:** If an element has a corresponding entry in the \`Project Elements Data\`, and it includes specific \`generateInstructions\`, follow those instructions for styling that element.
  *   **Layout:** Use CSS flexbox or grid to create the layout structure observed in the image.
  *   **Common Elements:** Include basic styling for common HTML elements like headings, paragraphs, lists, and buttons.
  *   **SCSS Syntax:** You can use any valid SCSS syntax, including nesting, variables, mixins, etc.
  *   **Angular Material Theming:** Apply Angular Material theming to style the Material components used in the component.

  **Example:**

  \`\`\`scss
  .recipe-container {
    display: flex;
    flex-direction: column;

    .recipe-title {
      font-size: 2em;
      margin-bottom: 10px;
    }

    // ... other styles
  }
  \`\`\`
  `;
}

export function getHtmlPrompt(templateData: TemplateData, scssFile: string): string {
  return `Next, let's create the component HTML file ('${templateData.fileName}.component.html').

  **SCSS:**
  \`\`\`scss
  ${scssFile}
  \`\`\`

  **Instructions:**

  *   **SCSS Integration:** Use the classes and IDs defined in the SCSS file from the previous message.
  *   **Elements Data:** Create the HTML elements based on the provided \`Elements Data\` and \`Project Elements Data\`.
  *   **Element Names:** Use the \`name\` property as a guide for the content of the element (e.g., if the name is 'title', generate a heading tag).
  *   **Element Types:** Use appropriate HTML tags based on the \`type\` property in the \`Elements Data\`.
  *   **Hierarchy:** Maintain the parent-child relationships defined in the \`Elements Data\` JSON.
  *   **Empty Children:** If an element has an empty \`children\` array, do not generate any child elements for it.
  *   **Project Elements Instructions:** If an element has a corresponding entry in the \`Project Elements Data\`, and it includes specific \`generateInstructions\`, follow those instructions for generating that element.
  *   **Angular Material Components:** Use Angular Material components where appropriate, ensuring they are styled correctly using the SCSS from the previous message.
  *   **Accessibility:** Ensure that the generated HTML is accessible by using appropriate ARIA attributes and semantic tags.

  **Example:**

  For the JSON:
  \`\`\`json
  {
    "name": "container",
    "type": "div",
    "children": [
      {
        "name": "title",
        "type": "h2",
        "children": []
      }
    ]
  }
  \`\`\`

  The generated HTML should be similar to:
  \`\`\`html
  <div class="container">
    <h2 class="title">Title</h2>
  </div>
  \`\`\`
  `;
}

export function getTsPrompt(templateData: TemplateData, htmlFile: string, scssFile: string, serviceFile: string): string {
  return `Finally, let's create the component TypeScript file ('${templateData.fileName}.component.ts').

  **HTML:**
  \`\`\`html
  ${htmlFile}
  \`\`\`

  **SCSS:**
  \`\`\`scss
  ${scssFile}
  \`\`\`

  **Service:**
  \`\`\`typescript
  ${serviceFile}
  \`\`\`

  **Instructions:**

  *   **Component Name:** The component should be named '${templateData.componentName}'.
  *   **Imports:** Include all necessary imports for an Angular component, including those specified in the \`Project Elements Data\` and the modules required for the features used in the HTML and the service.
  *   **Inputs/Outputs:** Define any input or output properties based on the elements and their intended functionality (e.g., if there's a button, it might have an output event).
  *   **Project Elements Instructions:** If an element from \`Project Elements Data\` has a 'generateInstructions' property, follow those instructions to implement the element's logic in the TypeScript code.
  *   **Component Logic:** Define the logic for the component, including:
      *   Fetching data from the service.
      *   Handling user interactions (e.g., button clicks, form submissions).
      *   Updating the component's state using signals.
      *   Any other logic required to support the functionality of the component.
  *   **Angular Best Practices:** Ensure that the code adheres to Angular coding conventions and best practices.
  *   **Code Support:** The code should fully support the generated HTML and SCSS from the previous messages.

  **Example Code Structure:**

  \`\`\`typescript
  import { Component } from '@angular/core';
  import { ${templateData.serviceName} } from './${templateData.fileName}.service';

  @Component({
    selector: '${templateData.selector}',
    templateUrl: './${templateData.fileName}.component.html',
    styleUrls: ['./${templateData.fileName}.component.scss'],
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [${templateData.serviceName}],
    imports: [
      // ... add necessary modules from Angular Material and other libraries
    ]
  })
  export class ${templateData.componentName} {
    // ... add properties, signals, and methods to support the component's functionality
  }
  \`\`\`
  `;
}

export function getSpecFilePrompt(tsPath: string, tsFile: string, specFileTemplate: string, htmlFile?: string): string {
  return `
**Task: Generate Unit Tests**

Generate a comprehensive unit test spec file for the provided TypeScript file. The spec file should include all necessary mocks, setup, and test cases to thoroughly validate the functionality of the code.

**Source Code**

*   File path: \`${tsPath}\`
*   File content:
    \`\`\`typescript
    ${tsFile}
    \`\`\`

*   HTML file content (if applicable):
    \`\`\`html
    ${htmlFile ?? ''}
    \`\`\`

**Spec File Template**

Use the following spec file template as a starting point. Modify or enhance it as needed to ensure comprehensive test coverage and adherence to best practices.

\`\`\`typescript
${specFileTemplate}
\`\`\`

**Instructions**

1.  **Analyze the Code:** Thoroughly analyze the provided TypeScript file and the contextual information to understand its functionality, dependencies, and potential test scenarios.

2.  **Complete the Spec File:**
    *   Fill in the missing parts of the spec file template, including:
        *   Necessary imports
        *   Mocks for dependencies using 'ts-mocks' (e.g., \`new Mock<ServiceName>()\`)
        *   Test setup and teardown (using \`beforeEach\` and \`afterEach\`)
        *   Test cases for each method or functionality

3.  **Mocking Guidelines:**
    *   Define mocks for external dependencies using arrow functions that return appropriate mock values.
    *   For methods returning \`Observable\`, wrap the mock value with \`of()\` from RxJS.
    *   For methods returning \`void\`, use an empty arrow function: \`() => {}\`.

4.  **Test Case Requirements:**
    *   Ensure your test cases cover:
        *   All public methods and properties
        *   Various input combinations and edge cases
        *   Both positive and negative test scenarios
        *   Error handling and exceptional paths
        *   Asynchronous behavior and side effects (if applicable)

5.  **Code Quality:**
    *   Adhere to established unit testing principles (e.g., Arrange-Act-Assert).
    *   Use descriptive test names and assertions.
    *   Provide clear comments explaining the purpose of each test.
    *   Maintain a clean and organized structure.
    *   Avoid testing implementation details; focus on behavior.

**Deliverable**

A complete and well-formatted spec file, ready for execution, ensuring comprehensive test coverage and code quality.
`;
}
