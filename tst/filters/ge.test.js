// Copyright 2011 Mark Cavage, Inc.  All rights reserved.

var test = require('tap').test;

var asn1 = require('asn1');


///--- Globals

var GreaterThanEqualsFilter;
var BerReader = asn1.BerReader;
var BerWriter = asn1.BerWriter;



///--- Tests

test('load library', function(t) {
  var filters = require('../../lib/index').filters;
  t.ok(filters);
  GreaterThanEqualsFilter = filters.GreaterThanEqualsFilter;
  t.ok(GreaterThanEqualsFilter);
  t.end();
});


test('Construct no args', function(t) {
  var f = new GreaterThanEqualsFilter();
  t.ok(f);
  t.ok(!f.attribute);
  t.ok(!f.value);
  t.end();
});


test('Construct args', function(t) {
  var f = new GreaterThanEqualsFilter({
    attribute: 'foo',
    value: 'bar'
  });
  t.ok(f);
  t.equal(f.attribute, 'foo');
  t.equal(f.value, 'bar');
  t.equal(f.toString(), '(foo>=bar)');
  t.end();
});


test('match true', function(t) {
  var f = new GreaterThanEqualsFilter({
    attribute: 'foo',
    value: 'bar'
  });
  t.ok(f);
  t.ok(f.matches({ foo: 'baz' }));
  t.end();
});


test('match false', function(t) {
  var f = new GreaterThanEqualsFilter({
    attribute: 'foo',
    value: 'bar'
  });
  t.ok(f);
  t.ok(!f.matches({ foo: 'abc' }));
  t.end();
});


test('parse ok', function(t) {
  var writer = new BerWriter();
  writer.writeString('foo');
  writer.writeString('bar');

  var f = new GreaterThanEqualsFilter();
  t.ok(f);
  t.ok(f.parse(new BerReader(writer.buffer)));
  t.ok(f.matches({ foo: 'bar' }));
  t.end();
});


test('parse bad', function(t) {
  var writer = new BerWriter();
  writer.writeString('foo');
  writer.writeInt(20);

  var f = new GreaterThanEqualsFilter();
  t.ok(f);
  try {
    f.parse(new BerReader(writer.buffer));
    t.fail('Should have thrown InvalidAsn1Error');
  } catch (e) {
    t.equal(e.name, 'InvalidAsn1Error');
  }
  t.end();
});
