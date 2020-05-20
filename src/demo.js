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
const { Select, NumberPrompt } = require('enquirer');

/* The JSON "pickables" below, when interpreted, are equivalent to these conditions:
   if ((system === 'F' && temperature < 95) || (system === 'C' && temperature < 35)) { message = 'Your temperature is dangerously low.' }
   if ((system === 'F' && temperature >= 95 && temperature <= 100) || 
     (system === 'C' && temperature >= 35 && temperature <= 37.8)) { message = 'Your temperature is normal.' }
  if ((system === 'F' && temperature > 100) || (system === 'C' && temperature > 37.8)) { message = 'Your temperature is dangerously high.' } */
const TEMP_PICKABLES: Array<PickLogic.PickableObject> = [
    {
        "id": "hypothermia",
        "pickCriteria": [
            {
                "sufficientToPick": [
                    {
                        "dataKey": "system",
                        "operator": "=",
                        "referenceValue": "F"
                    },
                    {
                        "dataKey": "temperature",
                        "operator": "<",
                        "referenceValue": 95
                    }
                ]
            },
            {
                "sufficientToPick": [
                    {
                        "dataKey": "system",
                        "operator": "=",
                        "referenceValue": "C"
                    },
                    {
                        "dataKey": "temperature",
                        "operator": "<",
                        "referenceValue": 35
                    }
                ]
            }
        ],
        "payload": {
            "message": "Your temperature is dangerously low."
        }
    },
    {
        "id": "normal",
        "pickCriteria": [
            {
                "sufficientToPick": [
                    {
                        "dataKey": "system",
                        "operator": "=",
                        "referenceValue": "F"
                    },
                    {
                        "dataKey": "temperature",
                        "operator": ">=",
                        "referenceValue": 95
                    },
                    {
                        "dataKey": "temperature",
                        "operator": "<=",
                        "referenceValue": 100
                    }
                ]
            },
            {
                "sufficientToPick": [
                    {
                        "dataKey": "system",
                        "operator": "=",
                        "referenceValue": "C"
                    },
                    {
                        "dataKey": "temperature",
                        "operator": ">=",
                        "referenceValue": 35
                    },
                    {
                        "dataKey": "temperature",
                        "operator": "<=",
                        "referenceValue": 37.8
                    }
                ]
            }
        ],
        "payload": {
            "message": "Your temperature is normal."
        }
    },
    {
        "id": "fever",
        "pickCriteria": [
            {
                "sufficientToPick": [
                    {
                        "dataKey": "system",
                        "operator": "=",
                        "referenceValue": "F"
                    },
                    {
                        "dataKey": "temperature",
                        "operator": ">",
                        "referenceValue": 100
                    }
                ]
            },
            {
                "sufficientToPick": [
                    {
                        "dataKey": "system",
                        "operator": "=",
                        "referenceValue": "C"
                    },
                    {
                        "dataKey": "temperature",
                        "operator": ">",
                        "referenceValue": 37.8
                    }
                ]
            }
        ],
        "payload": {
            "message": "Your temperature is dangerously high."
        }
    }
]

function readout() {
    console.log('\n\nJSON PickLogic, at your service.');
    console.log('\nThe governing JSON logic may be expressed as:\n');
    TEMP_PICKABLES.forEach(p => {
        const pickable = new PickLogic.Pickable(p);
        console.log(pickable.readoutsForPickableWithLocalized());
        console.log(`----> ${p.payload.message}\n`);
    })    
}
function demo() {
    const FAHR: string = 'Fahrenheit', CEL: string = 'Celsius';
    const prompt1 = new Select({
        name: 'system',
        message: 'Do you prefer Fahrenheit or Celsius?',
        choices: [FAHR, CEL]
    });
    const prompt2 = new NumberPrompt({
        name: 'temp',
        message: 'What is your temperature?'
    })
    prompt1.run().then(system => {
        prompt2.run().then(temperature => {
            const data: PickLogic.EvaluableData = {
                system: {
                    value: system === FAHR ? 'F' : 'C',
                    datatype: 'string'
                },
                temperature: {
                    value: temperature,
                    datatype: 'number',
                    unit: FAHR ? '°F' : '°C'
                }
            }
            const picker = new PickLogic.Picker(TEMP_PICKABLES);
            const pick: PickLogic.PickableObject = picker.pickForData(data);
            console.log('\n' + pick.payload.message + '\n');
        })
    })
}

readout();
demo();