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
import type { EvaluableData, EvaluableValue } from './index';

export const HELPERS_PREFIX: string = 'HELPERS.';
export const HELPERS: { [key: string]: { dependencies?: Array<string>,
    calculate: (calcData?: EvaluableData) => ?EvaluableValue, calculation?: (calcData: EvaluableData) => string } } = {
    date: {
        calculate: () => new Date().toString()
    },
    referenceHelper: {
        dependencies: ['constitution', 'declaration'],
        calculate: (calcData: { constitution: number, declaration: number }) =>
            calcData['constitution'] - calcData['declaration'],
        calculation: (calcData: { constitution: number, declaration: number }) =>
            `${calcData['constitution']} - ${calcData['declaration']}`
    }
};

function narrowedDataForRawData(functionName: string, data: ?EvaluableData): EvaluableData {
    const dataForFunction = {};
    if (HELPERS[functionName].hasOwnProperty('dependencies')) {
        HELPERS[functionName].dependencies.forEach(dep => {
            if (!data || !data.hasOwnProperty(dep)) {
                throw new Errors.UnevaluableError(dep);
            }
            let finalValue = data[dep].value;
            if (typeof finalValue === 'string' && finalValue.startsWith('NUMBER.')) {
                // convert pseudo-numeric values
                finalValue = parseInt(finalValue.substr(7), 10);
            }
            dataForFunction[dep] = finalValue;
        });
    }
    return dataForFunction;
}

export const isTemplatedString = (str: string): boolean => {
    return (!!str && str.indexOf('{') > -1);
}
export const fillTemplate = (str: string, data: ?EvaluableData): ?string => {
    if (!str) { return null; }
    let literalized = str;
    while(literalized.indexOf('{') > -1) {
        const start = literalized.indexOf('{');
        const replaceable = literalized.substr(start, literalized.indexOf('}') - start + 1);
        const functionName = replaceable.substr(`{${HELPERS_PREFIX}`.length).slice(0, -1);
        literalized = literalized.replace(replaceable, HELPERS[functionName].calculate(narrowedDataForRawData(functionName, data)));
    }
    return literalized;
}
export const calculateForHelperFunction = (functionName: string, data: ?EvaluableData): ?EvaluableValue => {
    if (HELPERS.hasOwnProperty(functionName)) {
        return HELPERS[functionName].calculate(narrowedDataForRawData(functionName, data));
    } else {
        throw new Error(`no calculation function for ${functionName}`);
    }
}
export const calculationForHelperFunction = (functionName: string, data: ?EvaluableData): string => {
    if (HELPERS.hasOwnProperty(functionName)) {
        return HELPERS[functionName].calculation(narrowedDataForRawData(functionName, data));
    } else {
        throw new Error(`no calculation function for ${functionName}`);
    }
}