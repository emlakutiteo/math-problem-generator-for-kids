export interface Operations {
  add: boolean;
  subtract: boolean;
  multiply: boolean;
  divide: boolean;
}

export interface GeneratorConfig {
  min: number;
  max: number;
  count: number;
  operations: Operations;
  useParentheses: boolean;
  numOperations: number;
}
