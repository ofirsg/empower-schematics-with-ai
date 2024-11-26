import { ToolOptions } from '../tool-interfaces';
import { strings } from '@angular-devkit/core';

export function getIndexTsPromptTemplate(options: ToolOptions, exampleTool: string): string {
  return `
**Task: Generate Angular Schematic Tool Code**

**Objective:**

Generate the complete and functional TypeScript code for an Angular schematic tool named '${options.name}'. This code will be used within the 'index.ts' file of the schematic.

**Tool Specifications:**

* **Name:** ${options.name}
* **Description:** ${options.description}
* **Functionality:** ${options.instructions}

**Code Template:**

\`\`\`typescript
import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { ToolOptions } from './tool-interfaces';

// Other necessary imports (e.g., for file manipulation, template generation)

export function ${strings.camelize(options.name)}(options: ToolOptions): Rule {
  return async (tree: Tree, _context: SchematicContext): Promise<void> => {
    // Implementation Logic (to be generated by the LLM)
  };
}
\`\`\`

**Implementation Guidelines:**

1. **Adhere to Angular best practices and coding conventions.**
2. **Utilize the provided 'options' object to access tool-specific configurations.**
3. **Leverage the 'tree' object for file manipulation within the Angular project.**
4. **Include clear and concise comments to explain the code's purpose and functionality.**
5. **Handle potential errors gracefully and provide informative messages.**
6. **Ensure the generated code is well-structured, modular, and maintainable.**
7. **If applicable, generate or modify templates based on the tool's functionality.**
8. **Consider using external libraries or utilities if they enhance the tool's capabilities.**

**Example:**

If the tool is named "component" and the instructions are "Create a new Angular component with specified name and selector," the generated code should:

* Validate the provided component name and selector.
* Create the component files (TypeScript, HTML, CSS) with appropriate content.
* Update the relevant Angular module to include the new component.
* Optionally, provide additional features like adding routing or template content based on user input.

**Output:**

The output should be the fully implemented TypeScript code for the 'index.ts' file, ready to be used within the Angular schematic.

**Existing Tool Example (index.ts file):**
Here is an example of the index.ts of a schematic tool that add new tool to the schematics collection.

\`\`\`typescript index.ts
${exampleTool}
\`\`\`
`;
}