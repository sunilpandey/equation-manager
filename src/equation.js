/**
 * operators: "+-/*^"
 * equation example : x^y+z+c
 * EquationManager:
 * * createEquation(...args): eqId
 * * editEquation(eqId, ...args): true //overwrite
 * * deleteEquation(eqId): true // throw error if being used by someone
 * * mergeEquations(eqId1, eqId2, operator): eqId3
 * * mergeEquations(eqId2, eqId3, operator): eqId4 //reflect changes if eq1 edited
 * * editEquation(eqId1, ...args): true //overwrite, reflect changes in eq3 & eq4
 * * printEquation(eqId4): string
 * * solveEquation(eqId3, {x:value1, z: value2}): number
 * 
 * * DON'T USE ANY SHORTCUTS
 **/
import { Stack } from "./stack";
export const EquationManager = () => {
    const map = new Map();
    let eqId = 0;
    const createEquation = (equation) => {
        map.set(++eqId, equation);
        return eqId;
    }

    const editEquation = (eqId, equation) => {
        map.set(eqId, equation);
    }

    const priorityOrder = (op) => {
        switch (op) {
            case '+':
            case '-':
                return 1;
            case '*':
            case '/':
            case '%':
                return 2;
            case '^':
                return 3;
        }
    }

    const calcResult = (variableValues) => {
        return (left, right, operator) => {
            let leftValue = left;
            if (typeof leftValue === "string") {
                leftValue = variableValues[leftValue];
            }

            let rightValue = right;
            if (typeof rightValue === "string") {
                rightValue = variableValues[rightValue];
            }

            const nullValues = [undefined, null];
            if (nullValues.includes(leftValue) || nullValues.includes(rightValue)) {
                throw new Error('Not all values are available');
            }

            switch (operator) {
                case '+':
                    return leftValue + rightValue;
                case '-':
                    return leftValue - rightValue;
                case '%':
                    return leftValue % rightValue;
                case '/':
                    // Returns NaN in case of rightValue 0;
                    return leftValue / rightValue;
                case '*':
                    return leftValue * rightValue;
                case '^':
                    return Math.pow(leftValue, rightValue);
            }
        }
    }

    const solveEquation = (eqId, variablesMap) => {
        const operatorList = ['+', '-', '*', '/', '%', '^']
        const elementStack = Stack();
        const opStack = Stack();
        const eq = getEquation(eqId);
        const evaluator = calcResult(variablesMap);
        const evaluate = (op) => {
            
            const op2 = elementStack.pop();
            const op1 = elementStack.pop();
            if(typeof op2 === "undefined" || typeof op1 === "undefined") {
                throw new Error('malformed exression');
            }
            const result = evaluator(op1, op2, op);
            elementStack.push(result);
        }
        let index = -1;
        const solveEq = (isOpStackEmpty) => {
            while (++index < eq.length) {
                const ch = eq.charAt(index);
                if(ch === ')') {
                    break;
                } else if(ch == '(') {
                    opStack.push('(');
                    const result = solveEq(() => opStack.top() == '(');
                    opStack.pop();
                    elementStack.push(result);
                } else if (operatorList.includes(ch)) {
                    const opPriority = priorityOrder(ch);
                    while (!isOpStackEmpty() && priorityOrder(opStack.top()) >= opPriority) {
                        const topOp = opStack.pop();
                        evaluate(topOp);
                    }
                    opStack.push(ch);
                } 
                else {
                    elementStack.push(ch);
                }
            }
    
            while (!isOpStackEmpty()) {
                const operator = opStack.pop()
                evaluate(operator);
            }
            return elementStack.pop();
        }
        return solveEq(() => opStack.empty());
    }

    const getEquation = (eqId) => {
        const eq = map.get(eqId);
        if(!eq) {
            throw new Error("Malformed expression or expression got deleted!!")
        }
        if (typeof eq === "object") {

            let left = eq.left;
            if (typeof left === "number" || typeof left === "object") {
                left = getEquation(left);
            }

            let right = eq.right;
            if (typeof right === "number" || typeof right === "object") {
                right = getEquation(right);
            }
            return left + eq.op + right
        }
        return eq;
    }

    const mergeEquations = (left, right, op) => {
        if(!map.get(left) || !map.get(right)) {
            throw Error('Either or both of equation does not exist');
        }
        const eq = createEquation({left, right, op});
        return eq;
    }

    const printEquation = (eqId) => {
        console.log(getEquation(eqId));
    }

    const deleteEquation = (eqId) => {
        for(const [key, value] of map){
            if(typeof value === "object" &&
                (value.left === eqId || value.right === eqId)) {
                throw new Error(`Dependency found in ${key}`);
            }
        }
        map.delete(eqId);
    }
    return {
        createEquation,
        solveEquation,
        printEquation,
        mergeEquations,
        getEquation,
        editEquation,
        deleteEquation
    }
}

