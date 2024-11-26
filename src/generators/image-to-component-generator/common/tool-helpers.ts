import { strings } from '@angular-devkit/core';
import { Tree } from '@angular-devkit/schematics';
import { treeToFlatArray } from '../../common/common-utils';
import {
  ElementData,
  ElementsData,
  ElementType,
  ProjectElementData,
  TemplateData,
} from './tool-interfaces';
import { projectElementsData } from './tool-consts';

export function getTemplateData(pathToCreate: string): TemplateData {
  const createPathParts = pathToCreate.split('/');
  const componentDirectoryName = createPathParts[createPathParts.length - 1];
  const name = strings.classify(componentDirectoryName);
  const path = `${pathToCreate}/${componentDirectoryName}`;

  return {
    selector: `app-${componentDirectoryName}`,
    componentName: `${name}Component`,
    componentPath: `${path}.component`,
    serviceName: `${name}Service`,
    servicePath: `${path}.service`,
    fileName: componentDirectoryName,
  };
}

export function extractElementsData(elementsTreeJson: string): ElementsData {
  let elementsTreeObject;
  try {
    elementsTreeObject = JSON.parse(elementsTreeJson);
  } catch (err) {
    elementsTreeObject = null;
  }
  const elementsTree: ElementData = elementsTreeObject?.length > 0 ? elementsTreeObject[0] : elementsTreeObject;
  const projectElements: ProjectElementData[] =
    Array.from(new Set<ElementType>(treeToFlatArray(elementsTree).map(e => e.type)))
      .map(elementType => projectElementsData[elementType]);

  return { elementsTree, projectElements };
}

export function getComponentSpecFileTemplate(templateData: TemplateData): string {
  return `import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ${templateData.componentName} } from './${templateData.fileName}.component';
import { Mock } from 'ts-mocks';

describe('${templateData.componentName}', () => {
  let component: ${templateData.componentName};
  let fixture: ComponentFixture<${templateData.componentName}>;
  // TODO: Define mocks and provide them, use ts-mock: \`let providerTypeMock: Mock<DependencyType>;\`

  beforeEach(async () => {
    // TODO: initialize mocks, in format: \`providerTypeMock = new Mock<DependencyType>({ method: () => {})\`

    await TestBed.configureTestingModule({
      providers: [
        // TODO: add mock providers, in format: \`{ provide: DependencyType, useFactory: () => dependencyTypeMock.Object }\`
      ],
      declarations: [
        ${templateData.componentName},
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      .compileComponents();
    }
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(${templateData.componentName});
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // TODO: Generate unit tests for the file
});
`;
}

export function getServiceSpecFileTemplate(templateData: TemplateData): string {
  return `import { TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ${templateData.serviceName} } from './${templateData.fileName}.service';
import { Mock } from 'ts-mocks';

describe('${templateData.serviceName}', () => {
  let service: ${templateData.serviceName};
  // TODO: Define mocks and provide them, use ts-mock: \`let providerTypeMock: Mock<DependencyType>;\`

  beforeEach(
    waitForAsync(() => {
      // TODO: initialize mocks, in format: \`providerTypeMock = new Mock<DependencyType>({ method: () => {})\`

      TestBed.configureTestingModule({
        providers: [
          // TODO: add mock providers, in format: \`{ provide: DependencyType, useFactory: () => dependencyTypeMock.Object }\`
        ],
        schemas: [NO_ERRORS_SCHEMA]
      });
      service = TestBed.inject(${templateData.serviceName});
    })
  );

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  // TODO: Generate unit tests for the file
});
`;
}

export function getExampleFilesText(tree: Tree): string {
  const htmlFile = tree.read('src/app/examples/ongoing-projects/ongoing-projects.component.html').toString();
  const scssFile = tree.read('src/app/examples/ongoing-projects/ongoing-projects.component.scss').toString();
  const tsFile = tree.read('src/app/examples/ongoing-projects/ongoing-projects.component.ts').toString();
  const specFile = tree.read('src/app/examples/ongoing-projects/ongoing-projects.component.spec.ts').toString();
  const serviceFile = tree.read('src/app/examples/ongoing-projects/ongoing-projects.service.ts').toString();
  const serviceSpecFile = tree.read('src/app/examples/ongoing-projects/ongoing-projects.service.spec.ts').toString();

  return `
\`\`\`ongoing-projects.service.ts
${serviceFile}
\`\`\`

\`\`\`ongoing-projects.service.spec.ts
${serviceSpecFile}
\`\`\`

\`\`\`ongoing-projects.component.html
${htmlFile}
\`\`\`

\`\`\`ongoing-projects.component.scss
${scssFile}
\`\`\`

\`\`\`ongoing-projects.component.ts
${tsFile}
\`\`\`

\`\`\`ongoing-projects.component.spec.ts
${specFile}
\`\`\`
  `;
}
