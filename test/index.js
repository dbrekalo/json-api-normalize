var assert = require("chai").assert;
var normalize = require("../");

var testItem;
var testCollection;
var anotherTestItem;
var yetAnotherTestItem;

beforeEach(function() {

    testCollection = {
        data: [{
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
                ]},
                comments: {data: [
                    {id: '1', 'type': 'comment'}
                ]}
            }
        }],
        included: [{
            type: 'user',
            id: '42',
            attributes: {
                firstName: 'John',
                lastName: 'Doe',
            },
            relationships: {
                boss: {data: {'id': '42', 'type': 'user'}},
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
        }, {
            type: 'comment',
            id: '1',
            attributes: {
                text: 'Lorem ipsum dolor sit ament'
            }
        }]
    };

    testItem = {
        data: testCollection.data[0],
        included: testCollection.included
    };

    anotherTestItem = {
        data: testCollection.data[0]
    };

    yetAnotherTestItem = JSON.stringify(anotherTestItem);

});


describe("Json api normalize", function() {

    it('retrieves single propery from entity', function() {

        assert.strictEqual(normalize(testItem, 'title'), 'JSON API paints my bikeshed!');
        assert.strictEqual(normalize(testItem).get('title'), 'JSON API paints my bikeshed!');

    });

    it('accepts string as dataset input', function() {

        assert.strictEqual(normalize(yetAnotherTestItem, 'title'), 'JSON API paints my bikeshed!');

    });

    it('multiple properties are retrieved as object', function() {

        assert.deepEqual(normalize(anotherTestItem).get(['id', 'type', 'title']), {
            id: '1',
            type: 'article',
            title: 'JSON API paints my bikeshed!'
        });

    });

    it('returns undefined for unknown attribute', function() {

        assert.isUndefined(normalize(testItem).get('unknownAttribute'));

    });

    it('returns undefined for unknown relation and relation attribute', function() {

        assert.isUndefined(normalize(testItem).get('author.unknownAttribute'));
        assert.isUndefined(normalize(testItem).get('publisher'));
        assert.isUndefined(normalize(testItem).get('publisher.name'));

    });

    it('returns relation as normalized object', function() {

        var authorNormalized = normalize(testItem).get('author');
        var tagsNormalized = normalize(testItem).get('tags');

        assert.instanceOf(authorNormalized, normalize);
        assert.instanceOf(tagsNormalized, normalize);

        assert.strictEqual(authorNormalized.get('firstName'), 'John');
        assert.deepEqual(tagsNormalized.get('name'), ['tag 1', 'tag 2']);

    });

    it('can be called with new operator', function() {

        assert.instanceOf(new normalize(testItem), normalize);

    });

    it('throws error with invalid input', function() {

        assert.throws(function() {
            normalize(undefined);
        });

        assert.throws(function() {
            normalize({});
        });

    });

    it('returns array for one to many relation when relation length is one', function() {

        var dataItem = normalize(testItem).get(['comments.text']);

        assert.deepEqual(dataItem, {
            comments: [{
                "text": "Lorem ipsum dolor sit ament"
            }]
        });

        var dataCollection = normalize(testCollection).get(['comments.text']);

        assert.deepEqual(dataCollection, [{
            comments: [{
                "text": "Lorem ipsum dolor sit ament"
            }]
        }]);

    });

    it('retrieves collection attributes and circular references', function() {

        var data = normalize(testCollection).get([
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

        assert.deepEqual(data, [{
            id: '1',
            title: 'JSON API paints my bikeshed!',
            body: 'The shortest article. Ever.',
            author: {
                id: '42',
                firstName: 'John',
                lastName: 'Doe',
                boss: {
                    firstName: 'John',
                    lastName: 'Doe'
                }
            },
            tags: [{
                id: '1',
                name: 'tag 1'
            }, {
                id: '2',
                name: 'tag 2'
            }]
        }]);

    });

});