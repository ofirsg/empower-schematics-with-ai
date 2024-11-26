import inquirer from 'inquirer';

export async function inquirerPromptConfirmation(question: string): Promise<boolean> {
  const result = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmation',
      message: question,
      default: false,
    },
  ]);

  return result?.['confirmation'] ?? false;
}

export async function inquirerPromptText(message: string): Promise<string> {
  const result = await inquirer.prompt([
    {
      type: 'input',
      name: 'text',
      message,
      default: '',
    },
  ]);

  return result?.['text'] ?? null;
}

export async function inquirerPromptList(message: string, choices: string[]): Promise<string> {
  const result = await inquirer.prompt([
    {
      type: 'list',
      name: 'choice',
      message,
      choices,
    },
  ]);

  return result?.['choice'] ?? null;
}

