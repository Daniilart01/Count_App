/// <reference types="vite/client" />
type Operation = '+' | '-' | '*' | ':';

type Levels = 1 | 2 | 3 | 4;

type OperationsActive = {
  add: boolean,
  subtract: boolean,
  multiply: boolean,
  divide: boolean,
};

type Expression = {
  firstOperand: number,
  operation: Operation,
  secondOperand: number,
  result: number,
};

type ChallengeScore = {
  correctScore: number,
  incorrectScore: number,
};
