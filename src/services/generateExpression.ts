export const generateExpression = (
  operations: OperationsActive = {
    add: true,
    subtract: true,
    multiply: true,
    divide: true,
  }, 
  level: Levels = 4
): Expression => {
  const [operation] = getRandomOperation(operations);
  
  const firstOperand = Math.floor(Math.random() * 1000) + level;
  let secondOperand = Math.floor(Math.random() * 1000) + level;

  do {
    secondOperand = Math.floor(Math.random() * 1000) + 1;
  } while (secondOperand > firstOperand);


  if (operation === '-') {
    do {
      secondOperand = Math.floor(Math.random() * 1000) + 1;
    } while (secondOperand > firstOperand);
  } else if (operation === ':') {
    do {
      secondOperand = Math.floor(Math.random() * 1000) + 1;
    } while (firstOperand % secondOperand !== 0);
  }

  let result = 0;

  switch (operation) {
    case '+':
      result = firstOperand + secondOperand;
      break;
    case '-':
      result = firstOperand - secondOperand;
      break;
    case '*':
      result = firstOperand * secondOperand;
      break;
    case ':':
      result = firstOperand / secondOperand;
      break;
    default:
  }

  return {
    firstOperand,
    operation,
    secondOperand,
    result
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


function getNumberTenHundred() {
  return Math.floor(Math.random() * 91) + 10;
}

function getNumberHundredThreeHundred() {
  return Math.floor(Math.random() * 201) + 100;
}

function getNumberThreeHundredThousend() {
  return Math.floor(Math.random() * 701) + 300;
}

function getNumberThreeThousendTenThousend() {
  return Math.floor(Math.random() * 9001) + 1000;
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