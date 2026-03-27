import test from 'node:test';
import assert from 'node:assert/strict';
import { getBranchGroup, getYearGroup } from './branchMapping.js';

test('getBranchGroup maps CS/IT branches', () => {
    assert.equal(getBranchGroup('Computer Science & Engineering'), 'CS-IT');
    assert.equal(getBranchGroup('Information Technology'), 'CS-IT');
});

test('getBranchGroup defaults non CS branches to CORE', () => {
    assert.equal(getBranchGroup('Mechanical Engineering'), 'CORE');
    assert.equal(getBranchGroup('Civil Engineering'), 'CORE');
});

test('getYearGroup maps senior years to 3-4', () => {
    assert.equal(getYearGroup('3rd Year'), '3-4');
    assert.equal(getYearGroup('final year'), '3-4');
    assert.equal(getYearGroup('Graduated'), '3-4');
});

test('getYearGroup maps junior years to 1-2', () => {
    assert.equal(getYearGroup('1st Year'), '1-2');
    assert.equal(getYearGroup('2nd Year'), '1-2');
});
