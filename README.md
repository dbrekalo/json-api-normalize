# JSON api normalize

[![Build Status](https://travis-ci.org/dbrekalo/json-api-normalize.svg?branch=master)](https://travis-ci.org/dbrekalo/json-api-normalize)
[![Coverage Status](https://coveralls.io/repos/github/dbrekalo/json-api-normalize/badge.svg?branch=master)](https://coveralls.io/github/dbrekalo/json-api-normalize?branch=master)
[![NPM Status](https://img.shields.io/npm/v/json-api-normalize.svg)](https://www.npmjs.com/package/json-api-normalize)

A simple way to traverse datasets based on JSON API specification.
Normalize is a lightweight javascript library with simple and powerful api.
Has no dependencies and weighs less than 1KB.

[Visit documentation site](http://dbrekalo.github.io/json-api-normalize/).

"If you’ve ever argued with your team about the way your JSON responses should be formatted, JSON API can be your anti-bikeshedding tool."
If you are new to JSON api we recommend you browse [json api website](http://jsonapi.org/) and
[examples](http://jsonapi.org/examples/) to familiarize yourself with specification.
This library is built upon standards and conventions of JSON api and provides a simple way to traverse and retrieve all those attributes and relations.

## Api and examples

Lets start with a typical JSON api formatted dataset:

```js
articleJsonApiData = {
    data: {
        type: 'article',
        id: '1',
        attributes: {
            title: 'JSON API paints my bikeshed!',
            body: 'The shortest article. Ever.'
        },
        relationships: {
            author: {data: {id: '42', type: 'user'}},
            publisher: {data: {id: '24', type: 'user'}},
            tags: {data: [
                {id: '1', 'type': 'tag'},
                {id: '2', 'type': 'tag'}
            ]}
        }
    },
    included: [{
        type: 'user',
        id: '42',
        attributes: {
            firstName: 'John',
            lastName: 'Doe',
        },
        relationships: {
            boss: {'data': {'id': '42', 'type': 'user'}},
        }
    }, {
        type: 'tag',
        id: '1',
        attributes: {
            name: 'tag 1'
        }
    }, {
        type: 'tag',
        id: '2',
        attributes: {
            name: 'tag 2'
        }
    }]
};
```

Using JSON api normalize we can retrive simple data like so:

```js
normalize(articleJsonApiData).get('title');
// will return 'JSON API paints my bikeshed!

normalize(articleJsonApiData).get('author.firstName');
// will output 'John'

normalize(articleJsonApiData).get(['id', 'title', 'body']);
// will return
// {
//     id: '1',
//     title: 'JSON API paints my bikeshed!',
//     body: 'The shortest article. Ever.'
// }
```

Next example shows how to retrieve complex dataset that can include (circular) relation data:

```js
normalize(articleJsonApiData).get([
    'id',
    'title',
    'body',
    'author.id',
    'author.firstName',
    'author.lastName',
    'author.boss.firstName',
    'author.boss.lastName',
    'tags.id',
    'tags.name',
]);

// will return
// {
//     id: '1',
//     title: 'JSON API paints my bikeshed!',
//     body: 'The shortest article. Ever.',
//     author: {
//         id: '42',
//         firstName: 'John',
//         lastName: 'Doe',
//         boss: {
//             firstName: 'John',
//             lastName: 'Doe'
//         }
//     },
//     tags: [{
//         id: '1',
//         name: 'tag 1'
//     }, {
//         id: '2',
//         name: 'tag 2'
//     }]
// };
```

## Installation

Json api normalize is packaged as UMD library so you can use it both on client and server (CommonJS and AMD environment) or with browser globals.

```js
// install via npm
npm install json-api-normalize --save

// if you use bundler
var normalize = require('json-api-normalize');

// or just using browser globals
var normalize = window.jsonApiNormalize;
```