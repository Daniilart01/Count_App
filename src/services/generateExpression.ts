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
  
  const firstOperand = Math.floor(Math.random() * 1000) + 1;
  let secondOperand = Math.floor(Math.random() * 1000) + 1;

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
