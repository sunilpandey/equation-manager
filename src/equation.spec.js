import { expect, it } from '@jest/globals';
import { EquationManager } from './equation.js'
describe("Sample Test", () => {
    it('Simple Equation', () => {
        const { createEquation, solveEquation } = EquationManager();
        const eqId = createEquation('X+Y');
        expect(solveEquation(eqId, {X: 20, Y: 30})).toEqual(50);
    });

    it('Complex Equation', () => {
        const { createEquation, solveEquation } = EquationManager();
        const eqId = createEquation('X+Y*Z^M/R');
        expect(solveEquation(eqId, {X: 20, Y: 30, Z: 10, M: 2, R: 5})).toEqual(620);
    })
    it('Simple Braces Equation', () => {
        const { createEquation, solveEquation } = EquationManager();
        const eqId = createEquation('(X+Y)');
        expect(solveEquation(eqId, {X: 10, Y: 20})).toEqual(30);
    })
    it('Complex Equation with braces', () => {
        const { createEquation, solveEquation } = EquationManager();
        const eqId = createEquation('X+(Y*Z)^M/R');
        expect(solveEquation(eqId, {X: 20, Y: 30, Z: 10, M: 2, R: 5})).toEqual(18020);
    });

    it('Get Equation Test', () => {
        const { createEquation, getEquation, mergeEquations } = EquationManager();
        const eqId1 = createEquation('X+Y*Z^M/R');
        const eqId2 = createEquation('X+R');
        const eqId3 = mergeEquations(eqId1, eqId2, '-');

        expect(getEquation(eqId3)).toEqual('X+Y*Z^M/R-X+R');
    });
    it('Merge Equation Test', () => {
        const { createEquation, solveEquation, mergeEquations } = EquationManager();
        const eqId1 = createEquation('X+(Y*Z)^M/R');
        const eqId2 = createEquation('X+R');
        const eqId3 = mergeEquations(eqId1, eqId2, '-');
        expect(solveEquation(eqId3, {X: 20, Y: 30, Z: 10, M: 2, R: 5})).toEqual(18005);
    });

    it('Dependecy Edit Equation Test', () => {
        const { createEquation, solveEquation, mergeEquations, editEquation } = EquationManager();
        const eqId1 = createEquation('X+(Y*Z)^M/R');
        const eqId2 = createEquation('X+R');
        const eqId3 = mergeEquations(eqId1, eqId2, '-');
        expect(solveEquation(eqId3, {X: 20, Y: 30, Z: 10, M: 2, R: 5})).toEqual(18005);
        editEquation(eqId1, "X");
        expect(solveEquation(eqId3, {X: 20, R: 5})).toEqual(5);
    });

    it('Dependecy Edit Equation Test', () => {
        const { createEquation, solveEquation, mergeEquations, editEquation } = EquationManager();
        const eqId1 = createEquation('X+(Y*Z)^M/R');
        const eqId2 = createEquation('X+R');
        const eqId3 = mergeEquations(eqId1, eqId2, '-');
        expect(solveEquation(eqId3, {X: 20, Y: 30, Z: 10, M: 2, R: 5})).toEqual(18005);
        editEquation(eqId1, "X");
        expect(solveEquation(eqId3, {X: 20, R: 5})).toEqual(5);
    });

    it('Test delete', () => {
        const { createEquation, getEquation, mergeEquations, deleteEquation } = EquationManager();
        const eqId1 = createEquation('X+(Y*Z)^M/R');
        
        deleteEquation(eqId1);
        expect(() => getEquation(eqId1)).toThrowError('Malformed expression or expression got deleted!!');
        const eqId2 = createEquation('X+R');
        const eqId3 = createEquation('M*N');
        const eqId4 = mergeEquations(eqId2, eqId3, '-');
        
        expect(() => deleteEquation(eqId2)).toThrowError(`Dependency found in ${eqId4}`);
    })    
})
