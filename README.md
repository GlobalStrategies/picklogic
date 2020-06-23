<h1 align="center">PickLogic</h1>

<p align="center">
    <b>A format for bundling JSON objects with selection conditions</br>An engine to do the selecting</b>
<br>
</p>
<p align="center">
    Created by <a href='https://www.globalstrategies.org'>Global Strategies</a> for <a href='https://www.noviguide.com'>NoviGuide</a>
<br>
</p>

## ❯ Quick Start
Install with [npm](https://www.npmjs.com/):

```sh
$ npm install picklogic
```
Install with [yarn](https://yarnpkg.com/en/):
```sh
$ yarn add picklogic
```

## ❯ Demo
Clone the PickLogic Demo repo, install dependencies, and run:

```sh
$ git clone git@github.com:GlobalStrategies/picklogic-demo.git
$ yarn
$ yarn demo
```
<img src="https://i.imgur.com/sIJW28X.png" alt="Preview of PickLogic Demo" width="500"/>

## ❯ Concept
Suppose you have two objects that you need to choose between:

    const NORMAL = { "color": "green", "message": "Your temperature is normal." }
    const FEVER = { "color": "red", "message": "You have a fever." }
You could write conditions to choose:

`if ((system === FAHRENHEIT && temperature > 100) || (system === CELSIUS && temperature > 37.8)) { return FEVER; }`

Or you could include the conditions with the data, thinking of them as the **criteria** to select the JSON object:

    {
      "pickCriteria": <CRITERIA>,
      "payload": { "color": "red", "message": "You have a fever." }
    }
The criteria can be encoded as equally acceptable **sets of conditions** that must be fulfilled:

    {
      "pickCriteria": [
        {
          IF system === FAHRENHEIT && temperature > 100
        },
        {
          IF system === CELSIUS && temperature > 37.8
        }
      ],
      "payload": { "color": "red", "message": "You have a fever." }
    }
If any of the `pickCriteria`  are satisfied, the **payload** is delivered. The array elements can be thought of as conditions separated by `OR`s. We call each of these condition sets `sufficientToPick`.  We then translate the `AND` conditions to array elements within each `sufficientToPick` property:


    {
      "pickCriteria": [
        {
          "sufficientToPick": [system === FAHRENHEIT, temperature > 100]
        },
        {
          "sufficientToPick": [system === CELSIUS, temperature > 37.8]
        }
      ],
      "payload": { "color": "red", "message": "You have a fever." }
    }
Finally we rewrite **conditions** in this form:


    "sufficientToPick": [
      {
        "dataKey": "system",
        "operator": "=",
        "referenceValue": "FAHRENHEIT"
      },
      {
        "dataKey": "temperature",
        "operator": ">",
        "referenceValue": 100
      }
    ]

## ❯ API
### Pickable
A pickable is a JSON object that includes an `id`, the `pickCriteria` under which it should be selected, and the `payload` it should deliver if selected.
The `Pickable` class constructor function is a convenience for making this JSON format human-readable.

**Params**

* `pickable` **{Object}**: A pickable JSON object of the form `{ "id": {string}, "pickCriteria": {Array}, "payload": {Object} }`
* `defaultKey` **{string}**: (optional). If all conditions perform logic on the same key, this property can be passed in and the `"dataKey"` property can be left out of all conditions.
* `solePickable` **{boolean}**: (optional). Important only for condition readouts; determines whether an "always pick" condition is rendered as `ALWAYS` or `IF not otherwise diverted`. If a `pickCriteria: []` pickable is not the only pickable in a set (`solePickable = false`), it must be a final "catch-all" so its conditionality is output as `IF not otherwise diverted`. If `solePickable = true`, the conditionality is simply output as `ALWAYS`.

**Example**

`const pickable = new Pickable(FEVER_PICKABLE, null, true)`

### readoutsForPickableWithLocalized()
Outputs a simplified string version of the conditions, optionally localizing fixed words like IF and AND. This can be used to help non-engineers validate the conditional logic.

**Params**

* `localized` **{function}**: (optional). A function that takes keywords and outputs localized equivalents (keywords used are ALWAYS, AND, OR, IF, NOT, NO, and 'not previously diverted'.

**Example**

`pickable.readoutsForPickableWithLocalized()`

**Sample output**

    [{ 
      conjunction: 'IF',
      conditionString: 'system = F & temperature > 100'
    }, {
      conjunction: 'OR',
      conditionString: 'system = C & temperature > 37.8'
    }]
This can be easily converted to a simple text format, as seen in the demo.
<br /><br />
### Picker
The Picker class digests passed JSON conditions (`pickables`) and can evaluate them against passed `data` hashes.

**Params**

* `pickables` **{Array}**: The JSON `pickables` to select among, each of the form `{ "id": {string}, "pickCriteria": {Array}, "payload": {Object} }`. You can optionally include a `"logicRank": {number}` property to evaluate the conditions on each object in a specific order.
* `defaultKey` **{string}**: (optional) If all conditions perform logic on the same key, this property can be passed in and the `"dataKey"` property can be left out of all conditions.

**Example**

`const picker = new Picker(jsonFile.pickables, 'temperature')`

### pickForData()
Given the passed data, get a matching JSON object, if any.

**Params**

* `data` **{Object}**: The data object should be a hash in the form `{ [dataKey]: { "value": {string | number | boolean | Array}, "datatype": {string} }`.

**Example**

`const pick = picker.pickForData({ system: { value: 'FAHRENHEIT', datatype: 'string' }, temperature: { value: 101, datatype: 'number' } })`
