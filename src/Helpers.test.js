// ---------------------------------------------------------------------------
// GLOBAL STRATEGIES, ALBANY, CALIFORNIA
// PICKLOGIC
// (c) 2017-present Global Strategies
// ---------------------------------------------------------------------------
// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at

//   http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

// @flow


import * as Helpers from './Helpers';

describe('Unmet dependencies throw error', () => {
    test('Unmet dependencies throw error in templated string', () => {
        const templatedString = '{HELPERS.referenceHelper} years passed between the Declaration of Independence and the ratification of the Consitution.';
        expect(() => {
            Helpers.fillTemplate(templatedString, { constitution: { value: 1787 } });
        }).toThrow();
    });
    test('Unmet dependencies throw error in calculation', () => {
        expect(() => {
            Helpers.calculateForHelperFunction('referenceHelper', { constitution: { value: 1787 } });
        }).toThrow();
    });
});

describe('Templated strings are handled correctly', () => {
    test('Templated strings are recognized', () => {
        expect(Helpers.isTemplatedString('Echo {name}')).toBe(true);
    });
    test('Non-templated strings are recognized', () => {
        expect(Helpers.isTemplatedString('Echo name')).toBe(false);
    });
    test('Templated string is filled', () => {
        const templatedString = '{HELPERS.referenceHelper} years passed between the Declaration of Independence and the ratification of the Consitution.';
        const expectedString = '11 years passed between the Declaration of Independence and the ratification of the Consitution.';
        expect(Helpers.fillTemplate(templatedString, { constitution: { value: 1787 }, declaration: { value: 1776 } })).toBe(expectedString);
    });
    test('Empty string returns null', () => {
        const templatedString = '';
        expect(Helpers.fillTemplate(templatedString, { constitution: { value: 1787 }, declaration: { value: 1776 } })).toBe(null);
    });
});

describe('Helpers calculate accurately', () => {
    describe('Invalid helper', () => {
        test('Invalid helper throws calculate error', () => {
            expect(() => {
                Helpers.calculateForHelperFunction('phonyHelper', { constitution: { value: 1787 } });
            }).toThrow();
        });
        test('Invalid helper throws calculation error', () => {
            expect(() => {
                Helpers.calculationForHelperFunction('phonyHelper', { constitution: { value: 1787 } });
            }).toThrow();
        });
    });
    describe('Reference helper', () => {
        test('Reference helper calculates accurately', () => {
            expect(Helpers.calculateForHelperFunction('referenceHelper', 
                { constitution: { value: 1787 }, declaration: { value: 1776 } })).toBe(11);
        });
    });
    describe('Other helpers', () => {
        test('Get date', () => {
            const helperDate = Helpers.calculateForHelperFunction('date', null);
            const now = new Date().toString();
            expect(helperDate).toBe(now);
        });
    });
});

describe('Helpers display calculations accurately', () => {
    test('Reference helper calc display', () => {
        const expectedString = '1787 - 1776';
        expect(Helpers.calculationForHelperFunction('referenceHelper', 
            { constitution: { value: 1787 }, declaration: { value: 1776 } })).toBe(expectedString);
    });
});