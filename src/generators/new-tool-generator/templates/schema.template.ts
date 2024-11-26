import { ToolOptions } from '../tool-interfaces';
import { strings } from '@angular-devkit/core'

export function getSchemaJsonFileTemplate(options: ToolOptions): string {
  return `{
  "$schema": "http://json-schema.org/schema",
  "$id": "${strings.classify(options.name)}",
  "title": "${options.description}",
  "type": "object",
  "properties": {
  },
  "required": []
}`;
}
