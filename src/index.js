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


import * as Errors from './Errors';
import * as Helpers from './Helpers';

// TYPES
export type EvaluableValue = string | number | boolean | Array<string>;
type AnnotatedDatapoint = {
    value: EvaluableValue,
    datatype: string,
    unit?: string
}
export type EvaluableData = {
    [key: string]: AnnotatedDatapoint
}

type ConditionObject = {
    dataKey?: string,
    operator?: string,
    referenceValue: EvaluableValue
}
type PickCriteria = {
    sufficientToPick: Array<ConditionObject>
}
type ConditionReadout = {
    conjunction: string,
    conditionString: string
}

type PickableObject = {
    id: string,
    name?: string,
    logicRank?: number,
    pickCriteria: Array<PickCriteria>,
    payload: Object
}

// CONSTANTS
const REWRITE_COMPOUND_STRINGS: string = true;
const REWRITE_INCLUSION_DATAKEYS: Array<string> = ['availableEquipment'];
const NUMBER_PREFIX: string = 'NUMBER.';
const NULL_VALUE: string = 'null';
const OPERATIONS = {
    '=': (a, b) => a === b,
    '!=': (a, b) => a !== b,
    '<': (a, b) => a < b,
    '<=': (a, b) => a <= b,
    '>': (a, b) => a > b,
    '>=': (a, b) => a >= b,
    '~': (a, b) => {
        // includes operator for arrays and strings
        if (!a) {
            return false;
        } else if (typeof a.indexOf === 'function') {
            return a.indexOf(b) > -1;
        }
        throw new Error('invalid operands');
    },
    '!~': (a, b) => {
        // does not include operator for arrays and strings
        if (!a) {
            return true;
        } else if (typeof a.indexOf === 'function') {
            return a.indexOf(b) === -1;
        }
        throw new Error('invalid operands');
    }
}
const ALWAYS = 'ALWAYS', AND = 'AND', OR = 'OR', IF = 'IF', 
    NOT = 'NOT', NO = 'NO', NOT_PREV_DIVERTED = 'not previously diverted';
const IS_NOT_CAPTURED = 'IS NOT CAPTURED',
    IS_CAPTURED = 'IS CAPTURED';
const defaultLocalized = (message: string): string => message;


class Picker {
    // pick item based on JSON conditional notation
    pickables: Array<PickableObject>
    defaultKey: ?string
    constructor(pickables: Array<PickableObject>, defaultKey?: string) {
        if (pickables && pickables[0] && pickables[0].logicRank) {
            // if items have logicRank property, they need to be evaluated in order — sort them
            this.pickables = pickables.sort((a, b) => (a.logicRank || 0) - (b.logicRank || 0));
        } else {
            this.pickables = pickables;
        }
        this.defaultKey = defaultKey;
    }
    pickForData(data: EvaluableData, excludedIds: ?Array<string> = null): ?PickableObject {
        if (!this.pickables) { return null; }
        const pick = this.pickables.find(rawPickable => {
            // first eliminate any excluded pickables
            if (excludedIds && rawPickable.id && excludedIds.indexOf(rawPickable.id) > -1) {
                return false;
            }
            // if not excluded, do full PickLogic analysis
            const pickable = new Pickable(rawPickable, this.defaultKey);
            return pickable.doDataSatisfyCriteria(data);
        });
        return pick || null;
    }
}

class Pickable {
    // A pickable will be picked if ALL conditions in a sufficientToPick array are met.
    // PickCriteria may include multiple sufficientToPick arrays.
    // Schematized, a pickable will be picked if:
    // [{ sufficientToPick: [x AND y AND z] } OR { sufficientToPick: [a AND b] }]
    pickCriteria: Array<PickCriteria>
    defaultKey: ?string
    isSolePickable: boolean

    constructor(pickable: PickableObject, defaultKey?: ?string, isSolePickable?: boolean) {
        // a default key can be passed in separately, to avoid redundancy in conditions
        this.pickCriteria = pickable.pickCriteria;
        this.defaultKey = defaultKey || null;
        this.isSolePickable = (isSolePickable === false) ? false : true; // unless explicitly false, assume true
    }
    doDataSatisfyCriteria(data: EvaluableData): boolean {
        if (!this.pickCriteria || this.pickCriteria.length === 0) {
            // if there are no criteria, this item should always be picked
            return true;
        }
        return this.pickCriteria.some(stp => {
            // check a sufficientToPick condition set
            // every condition must be true for the pick criteria to be met
            return stp.sufficientToPick.every(rawCond => {
                const cond = new Condition(rawCond, this.defaultKey);
                return cond.isTrueForData(data);
            });
        });
    }
    readoutsForPickableWithLocalized(localizedFn: ?(message: string) => string): Array<ConditionReadout> {
        const localized = localizedFn || defaultLocalized;
        let readouts;
        // outputs array of the form
        // [ { conjunction: 'IF', conditionString: 'city = NEW YORK & state = NY' }, 
        // { conjunction: 'OR', conditionString: 'city = SAN FRANCISCO & state = CA' } ]
        if (!this.pickCriteria || this.pickCriteria.length === 0) {
            readouts = this.isSolePickable ? [[ { conjunction: localized(ALWAYS), conditionString: '' } ]] :
                [[ { conjunction: localized(IF), conditionString: localized(NOT_PREV_DIVERTED) } ]];
        } else {
            readouts = this.pickCriteria.map((stp: PickCriteria, i: number) => {
                const andConditions = stp.sufficientToPick.map((rawCond, j: number) => {
                    let conjunction = localized(AND); // in most cases
                    if (i === 0 && j === 0) {
                        conjunction = localized(IF);
                    } else if (j === 0) {
                        conjunction = localized(OR);
                    }
                    const cond = new Condition(rawCond, this.defaultKey);
                    return { conjunction, conditionString: cond.conditionStringWithLocalized(localized) }
                });
                return [{ conjunction: andConditions[0].conjunction, 
                    conditionString: andConditions.map(c => c.conditionString).join(' & ') }];
            });
        }
        return [].concat.apply([], readouts);
    }
}

class Condition {
    dataKey: ?string
    operator: string
    referenceValue: ?string | boolean | number | Array<string>

    constructor({ dataKey, operator, referenceValue }: ConditionObject, defaultKey?: ?string) {
        this.dataKey = dataKey || defaultKey;
        this.operator = operator || '=';
        this.referenceValue = referenceValue;
    }
    isTrueForData(data: EvaluableData) {
        const { dataKey } = this;
        if (dataKey) {
            let dataValue;
            if (dataKey.startsWith(Helpers.HELPERS_PREFIX)) {
                // dataValue derived via helper function
                dataValue = Helpers.calculateForHelperFunction(dataKey.substr(Helpers.HELPERS_PREFIX.length), data);
            } else {
                dataValue = (data[dataKey] && data[dataKey].value !== null) ? data[dataKey].value : NULL_VALUE;
                if (dataValue === NULL_VALUE && this.referenceValue !== NULL_VALUE && 
                    this.operator !== '~' && this.operator !== '!~') {
                    // data for this data key is not available, and it is not being checked for nullity
                    // exception is inclusion statements where it's important to be able to verify, e.g.,
                    // that value X is not contained in a null (e.g. none-of-the-above) value
                    throw new Errors.UnevaluableError(dataKey);
                }
                if (typeof dataValue === 'string' && dataValue.startsWith(NUMBER_PREFIX)) {
                    // conver† numeric values stored as strings, e.g. NUMBER.10
                    dataValue = parseInt(dataValue.substr(7), 10);
                }
            }

            if (OPERATIONS[this.operator]) {
                return OPERATIONS[this.operator](dataValue, this.referenceValue);
            }
            throw new Error('invalid operator');
        } else {
            throw new Error('No data key');
        }
    }
    rewriteCompoundString(str: string): string {
        const dotIndex = str.lastIndexOf('.');
        return (dotIndex === -1) ? str.toUpperCase() : str.substr(dotIndex + 1).toUpperCase();
    }
    messageForNullity(nullity: boolean): string {
        // if affirmatively checking to see if value is null, you are checking to see
        // if the dataKey is NOT being captured; if you are checking to see if it is not null,
        // you are checking to see if the dataKey IS being captured
        return nullity ? IS_NOT_CAPTURED : IS_CAPTURED;
    }
    conditionStringWithLocalized(localizedFn: ?(message: string) => string): string {
        const localized = localizedFn || defaultLocalized;
        const { dataKey, operator, referenceValue } = this;
        if (!dataKey || !operator || referenceValue === null) { 
            // something went wrong
            return '';
        }

        let stringValue = '';
        switch (typeof referenceValue) {
            case 'string': {
                if (referenceValue === 'null') {
                    // special treatment for null checks
                    return `${dataKey} ${localized(this.messageForNullity(operator === '='))}`;
                } else if (operator.indexOf('~') > -1 && REWRITE_INCLUSION_DATAKEYS && 
                    REWRITE_INCLUSION_DATAKEYS.indexOf(dataKey) > -1) {
                    // rewrite "cities ~ New York" as |*NEW YORK| for downstream formatting
                    // rewrite "cities !~ New York" as |*NO NEW YORK| for downstream formatting
                    const includedValue = referenceValue.toUpperCase();
                    return (operator === '~') ? `|*${includedValue}|` :
                        `|*${localized(NO)} ${includedValue}|`;
                } else if (REWRITE_COMPOUND_STRINGS) {
                    // optional simplication of compound strings, e.g. rewrite gender.MALE as MALE
                    stringValue = this.rewriteCompoundString(referenceValue);
                } else {
                    stringValue = referenceValue.toUpperCase();
                }
                break;
            }
            case 'boolean': {
                // special treatment for booleans
                // if victorious = true -> "if victorious"
                // if victorious != false -> "if victorious"
                // if victorious = false -> "if NOT victorious"
                // if victorious != true -> "if NOT victorious"
                if ((operator === '=' && referenceValue) || (operator === '!=' && !referenceValue)) {
                    return dataKey;
                } else {
                    return `${localized(NOT)} ${dataKey}`;
                }
            }
            case 'number': {
                stringValue = `${referenceValue}`;
                break;
            }
            case 'object': {
                if (typeof referenceValue.join === 'function') {
                    stringValue = referenceValue.join(', ');
                }
                break;
            }
            default: {
                stringValue = referenceValue;
                break;
            }
        }
        return `${dataKey} ${operator} ${stringValue || ''}`;
    }
}
module.exports = {
    Picker,
    Pickable,
    Condition
}