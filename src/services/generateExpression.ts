export const generateExpression = (
  level: Levels,
  operations: OperationsActive = {
    add: true,
    subtract: true,
    multiply: true,
    divide: true,
  }, 
): Expression => {
  let firstOperand = 0;
  let secondOperand = 0;
  let result = 0;

  const [operation] = getRandomOperation(operations);
  let operands;

  switch (operation) {
    case '+':
      operands = generateAddOpearnds(level);
      firstOperand = operands[0];
      secondOperand = operands[1];
      result = firstOperand + secondOperand;
      break;

    case '-':
      operands = generateSubtractOpearnds(level);
      firstOperand = operands[0];
      secondOperand = operands[1];
      result = firstOperand - secondOperand;
      break;

    case '*':
      operands = generateMultiplyOpearnds(level);
      firstOperand = operands[0];
      secondOperand = operands[1];
      result = firstOperand * secondOperand;
      break;

    case ':':
      operands = generateDivideOpearnds(level);
      firstOperand = operands[0];
      secondOperand = operands[1];
      result = firstOperand / secondOperand;
      break;

    default:
  }

  return {
    firstOperand,
    secondOperand,
    operation,
    result,
  }
};

function getRandomOperation(operations: OperationsActive): [Operation, number] {
  const operationList: Operation[] = [];
  for (const key in operations) {
    if (operations[key as keyof OperationsActive]) {
      switch (key) {
        case 'add':
          operationList.push('+')
          break;
        case 'subtract':
          operationList.push('-')
          break;
        case 'multiply':
          operationList.push('*')
          break;
        case 'divide':
          operationList.push(':')
          break;
      }
    }
  }

  const randomIndex = Math.floor(Math.random() * operationList.length);
  return [operationList[randomIndex], randomIndex];
}

function generateAddOpearnds(level: number) {
  switch(level) {
    case 1:
      return [getNumberTenHundred(), getNumberTenHundred()];
    case 2:
      return [getNumberFiftyThreeHundred(), getNumberFiftyThreeHundred()];
    case 3:
      return [getNumberHundredThousend(), getNumberHundredThousend()];
    case 4:
      return [getNumberThousendFiveThousend(), getNumberThousendFiveThousend()];
    default: return [0, 0];
  }
}

function generateSubtractOpearnds(level: number) {
  let firstOperand: number;
  let secondOperand: number;

  switch(level) {
    case 1:
      firstOperand = getNumberTenHundred();
      do {
        secondOperand = getNumberTenHundred();
      } while (firstOperand < secondOperand);

      return [firstOperand, secondOperand];

    case 2:
      firstOperand = getNumberHundredThreeHundred();
      do {
        secondOperand = getNumberFiftyThreeHundred();
      } while (firstOperand < secondOperand);

      return [firstOperand, secondOperand];
    case 3:
      firstOperand = getNumberHundredThousend();
      do {
        secondOperand = getNumberHundredThousend() - 50;
      } while (firstOperand < secondOperand);

      return [firstOperand, secondOperand];
    case 4:
      firstOperand = getNumberThousendFiveThousend();
      do {
        secondOperand = getNumberThousendFiveThousend() - 100;
      } while (firstOperand < secondOperand);

      return [firstOperand, secondOperand];

    default: return [0, 0];
  }
}

function generateMultiplyOpearnds(level: number) {
  switch(level) {
    case 1:
      return [getNumberTwoTen(), getNumberTwoTen()];
    case 2:
      return [getNumberTenFifty(), getNumberTwoTen()];
    case 3:
      return [getNumberTenFifty(), getNumberToTwenty()];
    case 4:
      return [getNumberTenFifty(), getNumberTenFifty()];
    default: return [0, 0];
  }
}

function generateDivideOpearnds(level: number) {
  let firstOperand: number;
  let secondOperand: number;

  switch(level) {
    case 1:
      firstOperand = getNumberTwoTen();
      secondOperand = getNumberTwoTen();

      return [firstOperand * secondOperand, secondOperand];

    case 2:
      firstOperand = getNumberToTwenty();
      secondOperand = getNumberTwoTen();

      return [firstOperand * secondOperand, secondOperand];

    case 3:
      firstOperand = getNumberToTwenty();
      secondOperand = getNumberToTwenty();

      return [firstOperand * secondOperand, secondOperand];

    case 4:
      firstOperand = getNumberTenHundred();
      secondOperand = getNumberToTwenty();

      return [firstOperand * secondOperand, secondOperand];

    default: return [1, 1];
  }
}

function getNumberTenHundred() {
  return Math.floor(Math.random() * 91) + 10;
}

function getNumberFiftyThreeHundred() {
  return Math.floor(Math.random() * 251) + 50;
}

function getNumberHundredThreeHundred() {
  return Math.floor(Math.random() * 201) + 100;
}

function getNumberHundredThousend() {
  return Math.floor(Math.random() * 901) + 100;
}

function getNumberThousendFiveThousend() {
  return Math.floor(Math.random() * 4001) + 1000;
}

function getNumberTwoTen() {
  return Math.floor(Math.random() * 9) + 2;
}

function getNumberToTwenty() {
  return Math.floor(Math.random() * 19) + 2;
}

function getNumberTenFifty() {
  return Math.floor(Math.random() * 41) + 10;
}
