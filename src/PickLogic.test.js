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


import * as PickLogic from './index';

describe('Logic is evaluated correctly', () => {
    const data = {
        capital: { value: 'Washington', datatype: 'string' },
        capitals: { value: ['Sacramento', 'Trenton', 'Albany', 'Austin'], datatype: 'array' },
        cities: { value: null, datatype: 'array' },
        democracy: { value: true, datatype: 'boolean' },
        perfect: { value: false, datatype: 'boolean' },
        founding: { value: 1776, datatype: 'number' },
        vibranium: { value: 0, datatype: 'number' },
        pi: { value: 3.1415, datatype: 'number' },
        constitution: { value: 1787, datatype: 'number' },
        declaration: { value: 1776, datatype: 'number' },
        emptyString: { value: '', datatype: 'string' },
        numberString: { value: 'NUMBER.35', datatype: 'string' }
    };
    describe('Expressions are evaluated correctly', () => {
        describe('Simple string expressions are evaluated correctly', () => {
            test('String value identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'capital', operator: '=', referenceValue: 'Washington' });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('String value tacit identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'capital', referenceValue: 'Washington' });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('String value non-identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'capital', operator: '!=', referenceValue: 'Moscow' });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('String value inclusive', () => {
                const exp = new PickLogic.Condition({ dataKey: 'capital', operator: '~', referenceValue: 'Wash' });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('String value non-inclusive', () => {
                const exp = new PickLogic.Condition({ dataKey: 'capital', operator: '!~', referenceValue: 'Moscow' });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Empty string value includes string', () => {
                const exp = new PickLogic.Condition({ dataKey: 'emptyString', operator: '~', referenceValue: 'Wash' });
                expect(exp.isTrueForData(data)).toBe(false);
            });
            test('Empty string value does not include string', () => {
                const exp = new PickLogic.Condition({ dataKey: 'emptyString', operator: '!~', referenceValue: 'Wash' });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Number string parsed as number', () => {
                const exp = new PickLogic.Condition({ dataKey: 'numberString', operator: '=', referenceValue: 35 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
        });
        describe('Simple boolean expressions are evaluated correctly', () => {
            test('Boolean true value identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'democracy', operator: '=', referenceValue: true });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Boolean true value tacit identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'democracy', referenceValue: true });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Boolean true value non-identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'democracy', operator: '!=', referenceValue: false });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Boolean false value identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'perfect', operator: '=', referenceValue: false });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Boolean false value tacit identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'perfect', referenceValue: false });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Boolean false value non-identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'perfect', operator: '!=', referenceValue: true });
                expect(exp.isTrueForData(data)).toBe(true);
            });
        });
        describe('Simple integer expressions are evaluated correctly', () => {
            test('Non-zero integer value identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'founding', operator: '=', referenceValue: 1776 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero integer value tacit identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'founding', referenceValue: 1776 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero integer value non-identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'founding', operator: '!=', referenceValue: 1066 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero integer value greater', () => {
                const exp = new PickLogic.Condition({ dataKey: 'founding', operator: '>', referenceValue: 1775 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero integer value greater when equal', () => {
                const exp = new PickLogic.Condition({ dataKey: 'founding', operator: '>', referenceValue: 1776 });
                expect(exp.isTrueForData(data)).toBe(false);
            });
            test('Non-zero integer value greater equal', () => {
                const exp = new PickLogic.Condition({ dataKey: 'founding', operator: '>=', referenceValue: 1775 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero integer value greater equal when equal', () => {
                const exp = new PickLogic.Condition({ dataKey: 'founding', operator: '>=', referenceValue: 1776 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero integer value less', () => {
                const exp = new PickLogic.Condition({ dataKey: 'founding', operator: '<', referenceValue: 1777 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero integer value less when equal', () => {
                const exp = new PickLogic.Condition({ dataKey: 'founding', operator: '<', referenceValue: 1776 });
                expect(exp.isTrueForData(data)).toBe(false);
            });
            test('Non-zero integer value less equal', () => {
                const exp = new PickLogic.Condition({ dataKey: 'founding', operator: '<=', referenceValue: 1777 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero integer value less equal when equal', () => {
                const exp = new PickLogic.Condition({ dataKey: 'founding', operator: '<=', referenceValue: 1776 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Zero value identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'vibranium', operator: '=', referenceValue: 0 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Zero value tacit identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'vibranium', referenceValue: 0 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Zero value non-identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'vibranium', operator: '!=', referenceValue: 1000 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
        });
        describe('Simple decimal expressions are evaluated correctly', () => {
            test('Non-zero decimal value identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'pi', operator: '=', referenceValue: 3.1415 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero decimal value tacit identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'pi', referenceValue: 3.1415 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero decimal value non-identity', () => {
                const exp = new PickLogic.Condition({ dataKey: 'pi', operator: '!=', referenceValue: 3.1416 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero decimal value greater', () => {
                const exp = new PickLogic.Condition({ dataKey: 'pi', operator: '>', referenceValue: 3.1414 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero decimal value greater when equal', () => {
                const exp = new PickLogic.Condition({ dataKey: 'pi', operator: '>', referenceValue: 3.1415 });
                expect(exp.isTrueForData(data)).toBe(false);
            });
            test('Non-zero decimal value greater equal', () => {
                const exp = new PickLogic.Condition({ dataKey: 'pi', operator: '>=', referenceValue: 3.1414 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero decimal value greater equal when equal', () => {
                const exp = new PickLogic.Condition({ dataKey: 'pi', operator: '>=', referenceValue: 3.1415 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero decimal value less', () => {
                const exp = new PickLogic.Condition({ dataKey: 'pi', operator: '<', referenceValue: 3.1416 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero decimal value less when equal', () => {
                const exp = new PickLogic.Condition({ dataKey: 'pi', operator: '<', referenceValue: 3.1415 });
                expect(exp.isTrueForData(data)).toBe(false);
            });
            test('Non-zero decimal value less equal', () => {
                const exp = new PickLogic.Condition({ dataKey: 'pi', operator: '<=', referenceValue: 3.1416 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-zero decimal value less equal when equal', () => {
                const exp = new PickLogic.Condition({ dataKey: 'pi', operator: '<=', referenceValue: 3.1415 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
        });
        describe('Other cases', () => {
            test('No data key', () => {
                const exp = new PickLogic.Condition({ operator: '~', referenceValue: '1776' });
                expect(() => {
                    exp.isTrueForData(data);
                }).toThrow();
            });
            test('Array value inclusive', () => {
                const exp = new PickLogic.Condition({ dataKey: 'capitals', operator: '~', referenceValue: 'Austin' });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Array value inclusive, empty variable', () => {
                const exp = new PickLogic.Condition({ dataKey: 'cities', operator: '~', referenceValue: 'Austin' });
                expect(exp.isTrueForData(data)).toBe(false);
            });
            test('Array value non-inclusive', () => {
                const exp = new PickLogic.Condition({ dataKey: 'capitals', operator: '!~', referenceValue: 'Spokane' });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Array value non-inclusive, empty variable', () => {
                const exp = new PickLogic.Condition({ dataKey: 'cities', operator: '!~', referenceValue: 'Austin' });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Numeric datakey inclusive throws error', () => {
                const exp = new PickLogic.Condition({ dataKey: 'founding', operator: '~', referenceValue: '1776' });
                expect(() => {
                    exp.isTrueForData(data);
                }).toThrow();
            });
            test('Unmet direct dependency throws an error', () => {
                const exp = new PickLogic.Condition({ dataKey: 'e', operator: '=', referenceValue: 2.7183 });
                expect(() => {
                    exp.isTrueForData(data);
                }).toThrow();
            });
            test('Unmet helper dependency throws an error', () => {
                const exp = new PickLogic.Condition({ dataKey: 'HELPERS.referenceHelper', operator: '=', referenceValue: 11 });
                expect(() => {
                    exp.isTrueForData({ constitution: { value: 1787 } });
                }).toThrow();
            });
            test('Invalid helper throws an error', () => {
                const exp = new PickLogic.Condition({ dataKey: 'HELPERS.nonexistentHelper', operator: '=', referenceValue: 11 });
                expect(() => {
                    exp.isTrueForData(data);
                }).toThrow();
            });
            test('Invalid operator throws an error', () => {
                const exp = new PickLogic.Condition({ dataKey: 'pi', operator: '***', referenceValue: 3.1416 });
                expect(() => {
                    exp.isTrueForData(data);
                }).toThrow();
            });
            test('Null value evaluated', () => {
                const exp = new PickLogic.Condition({ dataKey: 'emperor', operator: '=', referenceValue: 'null' });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Non-null value evaluated', () => {
                const exp = new PickLogic.Condition({ dataKey: 'capital', operator: '!=', referenceValue: 'null' });
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Priority key is injected', () => {
                const exp = new PickLogic.Condition({ operator: '!=', referenceValue: 'Moscow' }, 'capital');
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Priority key is injected with tacit identity', () => {
                const exp = new PickLogic.Condition({ referenceValue: 'Washington' }, 'capital');
                expect(exp.isTrueForData(data)).toBe(true);
            });
            test('Reference helper calculates', () => {
                const exp = new PickLogic.Condition({ dataKey: 'HELPERS.referenceHelper', operator: '=', referenceValue: 11 });
                expect(exp.isTrueForData(data)).toBe(true);
            });
        });
    });

    describe('Pick criteria are evaluated correctly', () => {
        const data = {
            Luke: { value: 'Skywalker', datatype: 'string' },
            Han: { value: 'Solo', datatype: 'string' },
            Leia: { value: 'Organa', datatype: 'string' }
        };
        test('Single condition', () => {
            const pickable = new PickLogic.Pickable({
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "dataKey": "Luke",
                            "referenceValue": "Skywalker"
                        }
                    ]
                }]
            });
            expect(pickable.doDataSatisfyCriteria(data)).toBe(true);
        });
        test('Single condition with priority key', () => {
            const pickable = new PickLogic.Pickable({
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "referenceValue": "Skywalker"
                        }
                    ]
                }]
            }, 'Luke');
            expect(pickable.doDataSatisfyCriteria(data)).toBe(true);
        });
        test('Double condition', () => {
            const pickable = new PickLogic.Pickable({
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "dataKey": "Luke",
                            "referenceValue": "Skywalker"
                        },
                        {
                            "dataKey": "Leia",
                            "referenceValue": "Organa"
                        }
                    ]
                }]
            });
            expect(pickable.doDataSatisfyCriteria(data)).toBe(true);
        });
        test('Unsatisfied condition', () => {
            const pickable = new PickLogic.Pickable({
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "dataKey": "Luke",
                            "referenceValue": "Skywalker"
                        },
                        {
                            "dataKey": "Leia",
                            "referenceValue": "Skywalker"
                        }
                    ]
                }]
            });
            expect(pickable.doDataSatisfyCriteria(data)).toBe(false);
        });
        test('Unsatisfied condition followed by satisfied condition', () => {
            const pickable = new PickLogic.Pickable({
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "dataKey": "Luke",
                            "referenceValue": "Skywalker"
                        },
                        {
                            "dataKey": "Leia",
                            "referenceValue": "Skywalker"
                        }
                    ]
                }, {
                    "sufficientToPick": [
                        {
                            "dataKey": "Luke",
                            "referenceValue": "Skywalker"
                        },
                        {
                            "dataKey": "Leia",
                            "referenceValue": "Organa"
                        }
                    ]
                }]
            });
            expect(pickable.doDataSatisfyCriteria(data)).toBe(true);
        });
        test('No pick criteria (always pick)', () => {
            const pickable = new PickLogic.Pickable({
                pickCriteria: []
            });
            expect(pickable.doDataSatisfyCriteria(data)).toBe(true);
        });
        test('Unmet dependency throws an error', () => {
            const pickable = new PickLogic.Pickable({
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "dataKey": "Luke",
                            "referenceValue": "Skywalker"
                        },
                        {
                            "dataKey": "Lando",
                            "referenceValue": "Calrissian"
                        }
                    ]
                }]
            });
            expect(() => {
                pickable.doDataSatisfyCriteria(data);
            }).toThrow();
        });
    });

    describe('Picks are chosen based on criteria', () => {
        const data = {
            artist: { value: 'Leonardo da Vinci', datatype: 'string' },
            city: { value: 'London', datatype: 'string' },
            title: { value: 'Virgin of the Rocks', datatype: 'string' }
        };
        test('Empty array passed in', () => {
            const pick = new PickLogic.Picker(null);
            expect(pick.pickForData(data)).toEqual(null);
        });
        test('Second pickable true', () => {
            const pick = new PickLogic.Picker([{
                id: "not it",
                logicRank: 1,
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "dataKey": "artist",
                            "referenceValue": "Leonardo da Vinci"
                        },
                        {
                            "dataKey": "title",
                            "referenceValue": "Mona Lisa"
                        }
                    ]
                }]
            },
            {
                id: "it",
                logicRank: 2,
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "dataKey": "artist",
                            "referenceValue": "Leonardo da Vinci"
                        },
                        {
                            "dataKey": "title",
                            "referenceValue": "Virgin of the Rocks"
                        }
                    ]
                }]
            }]);
            expect(pick.pickForData(data).id).toEqual('it');
        });
        test('Second pickable excluded, ignored', () => {
            const pick = new PickLogic.Picker([{
                id: "not it",
                logicRank: 1,
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "dataKey": "artist",
                            "referenceValue": "Leonardo da Vinci"
                        },
                        {
                            "dataKey": "title",
                            "referenceValue": "Mona Lisa"
                        }
                    ]
                }]
            },
            {
                id: "it",
                logicRank: 2,
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "dataKey": "artist",
                            "referenceValue": "Leonardo da Vinci"
                        },
                        {
                            "dataKey": "title",
                            "referenceValue": "Virgin of the Rocks"
                        }
                    ]
                }]
            }]);
            expect(pick.pickForData(data, ['it'])).toEqual(null);
        });
        test('Neither pickable true', () => {
            const pick = new PickLogic.Picker([{
                id: "not it",
                logicRank: 1,
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "dataKey": "artist",
                            "referenceValue": "Leonardo da Vinci"
                        },
                        {
                            "dataKey": "title",
                            "referenceValue": "Mona Lisa"
                        }
                    ]
                }]
            },
            {
                id: "not it",
                logicRank: 2,
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "dataKey": "artist",
                            "referenceValue": "Leonardo da Vinci"
                        },
                        {
                            "dataKey": "title",
                            "referenceValue": "Lady with an Ermine"
                        }
                    ]
                }]
            }]);
            expect(pick.pickForData(data)).toEqual(null);
        });
        test('First-ranking pickable chosen', () => {
            const pick = new PickLogic.Picker([{
                id: "it2",
                logicRank: 2,
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "dataKey": "artist",
                            "referenceValue": "Leonardo da Vinci"
                        },
                        {
                            "dataKey": "title",
                            "referenceValue": "Virgin of the Rocks"
                        }
                    ]
                }]
            },
            {
                id: "it1",
                logicRank: 1,
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "dataKey": "artist",
                            "referenceValue": "Leonardo da Vinci"
                        },
                        {
                            "dataKey": "city",
                            "referenceValue": "London"
                        }
                    ]
                }]
            }]);
            expect(pick.pickForData(data).id).toEqual('it1');
        });
        test('Unmet dependency throws an error', () => {
            const pick = new PickLogic.Picker([{
                id: "it2",
                logicRank: 2,
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "dataKey": "artist",
                            "referenceValue": "Leonardo da Vinci"
                        },
                        {
                            "dataKey": "country",
                            "referenceValue": "London"
                        }
                    ]
                }]
            }]);
            expect(() => {
                pick.pickForData(data);
            }).toThrow();
        });
        test('Unmet dependency, with missing datakey throws an error', () => {
            const pick = new PickLogic.Picker([{
                id: "it2",
                logicRank: 2,
                pickCriteria: [{
                    "sufficientToPick": [
                        {
                            "referenceValue": "Leonardo da Vinci"
                        },
                        {
                            "dataKey": "country",
                            "referenceValue": "London"
                        }
                    ]
                }]
            }]);
            expect(() => {
                pick.pickForData(data);
            }).toThrow();
        });
    });
});

describe('Logic is output correctly', () => {
    describe('Expressions are output correctly', () => {
        describe('Simple string expressions are output correctly', () => {
            test('Simple identity with target string capitalization', () => {
                const exp = new PickLogic.Condition({ dataKey: 'capital', operator: '=', referenceValue: 'Washington' });
                expect(exp.conditionStringWithLocalized()).toBe('capital = WASHINGTON');
            });
            test('Simple identity with target string simplification', () => {
                const exp = new PickLogic.Condition({ dataKey: 'capital', operator: '=', referenceValue: 'capital.WASHINGTON' });
                expect(exp.conditionStringWithLocalized()).toBe('capital = WASHINGTON');
            });
            test('Tacit identity with target string capitalization', () => {
                const exp = new PickLogic.Condition({ dataKey: 'capital', referenceValue: 'Washington' });
                expect(exp.conditionStringWithLocalized()).toBe('capital = WASHINGTON');
            });
            test('Incomplete expression returns empty string', () => {
                const exp = new PickLogic.Condition({ referenceValue: 'Washington' });
                expect(exp.conditionStringWithLocalized()).toBe('');
            });
         });
        describe('Simple boolean expressions are output correctly', () => {
            test('Boolean true ouput', () => {
                const exp = new PickLogic.Condition({ dataKey: 'democracy', operator: '=', referenceValue: true });
                expect(exp.conditionStringWithLocalized()).toBe('democracy');
            });
            test('Boolean false output', () => {
                const exp = new PickLogic.Condition({ dataKey: 'empire', operator: '=', referenceValue: false });
                expect(exp.conditionStringWithLocalized()).toBe('NOT empire');
            });
            test('Null true ouput', () => {
                const exp = new PickLogic.Condition({ dataKey: 'president', operator: '=', referenceValue: 'null' });
                expect(exp.conditionStringWithLocalized()).toBe('president IS NOT CAPTURED');
            });
            test('Null false output', () => {
                const exp = new PickLogic.Condition({ dataKey: 'capital', operator: '!=', referenceValue: 'null' });
                expect(exp.conditionStringWithLocalized()).toBe('capital IS CAPTURED');
            });
        });
        describe('Simple numeric expressions are output correctly', () => {
            test('Non-zero integer ouput', () => {
                const exp = new PickLogic.Condition({ dataKey: 'founding', operator: '=', referenceValue: 1776 });
                expect(exp.conditionStringWithLocalized()).toBe('founding = 1776');
            });
            test('Non-zero decimal output', () => {
                const exp = new PickLogic.Condition({ dataKey: 'pi', operator: '>', referenceValue: 3 });
                expect(exp.conditionStringWithLocalized()).toBe('pi > 3');
            });
        });
    });
    describe('Pick criteria are output correctly', () => {
        test('No criteria (always) output', () => {
            const pickable = new PickLogic.Pickable({ pickCriteria: [] });
            expect(pickable.readoutsForPickableWithLocalized()).toEqual(expect.arrayContaining([{ conjunction: 'ALWAYS', conditionString: '' }]));
        });
        test('Single sufficientToPick output', () => {
            const pickable = new PickLogic.Pickable({ pickCriteria: [{
                "sufficientToPick": [
                    {
                        "dataKey": "Luke",
                        "referenceValue": "Skywalker"
                    },
                    {
                        "dataKey": "Lando",
                        "referenceValue": "Calrissian"
                    }
                ]
            }] });
            expect(pickable.readoutsForPickableWithLocalized()).toEqual(expect.arrayContaining([{ conjunction: 'IF', conditionString: 'Luke = SKYWALKER & Lando = CALRISSIAN' }]));
        });
        test('Double sufficientToPick output', () => {
            const pickable = new PickLogic.Pickable({ pickCriteria: [{
                "sufficientToPick": [
                    {
                        "dataKey": "Luke",
                        "referenceValue": "Skywalker"
                    },
                    {
                        "dataKey": "Lando",
                        "referenceValue": "Calrissian"
                    }
                ]
            }, {
                "sufficientToPick": [
                    {
                        "dataKey": "Leia",
                        "referenceValue": "Organa"
                    }
                ]
            }] });
            expect(pickable.readoutsForPickableWithLocalized(null)).toEqual(expect.arrayContaining([{ conjunction: 'IF', conditionString: 'Luke = SKYWALKER & Lando = CALRISSIAN' }, 
                { conjunction: 'OR', conditionString: 'Leia = ORGANA' }]));
        });
        test('If not otherwise diverted output', () => {
            const pickable = new PickLogic.Pickable({ pickCriteria: [] }, null, false);
            expect(pickable.readoutsForPickableWithLocalized(null)).toEqual(expect.arrayContaining([{ conjunction: 'IF', conditionString: 'not previously diverted' }]));
        });
        test('Rewrite inclusion (equipment) output', () => {
            const pickable = new PickLogic.Pickable({ pickCriteria: [{
                "sufficientToPick": [
                    {
                        "dataKey": "Luke",
                        "referenceValue": "Skywalker"
                    },
                    {
                        "dataKey": "availableEquipment",
                        "operator": "~",
                        "referenceValue": "LIGHT-SABER"
                    }
                ]
            }, {
                "sufficientToPick": [
                    {
                        "dataKey": "availableEquipment",
                        "operator": "!~",
                        "referenceValue": "DROID"
                    }
                ]
            }] });
            expect(pickable.readoutsForPickableWithLocalized(null)).toEqual(expect.arrayContaining([{ conjunction: 'IF', 
                conditionString: 'Luke = SKYWALKER & |*LIGHT-SABER|' }, { conjunction: 'OR', conditionString: '|*NO DROID|' }]));
        });
    });
});
