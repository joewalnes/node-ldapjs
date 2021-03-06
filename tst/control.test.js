// Copyright 2011 Mark Cavage, Inc.  All rights reserved.

var test = require('tap').test;

var asn1 = require('asn1');


///--- Globals

var BerReader = asn1.BerReader;
var BerWriter = asn1.BerWriter;
var Control;


///--- Tests

test('load library', function(t) {
  Control = require('../lib/index').Control;
  t.ok(Control);
  t.end();
});


test('new no args', function(t) {
  t.ok(new Control());
  t.end();
});


test('new with args', function(t) {
  var c = new Control({
    type: '2.16.840.1.113730.3.4.2',
    criticality: true
  });
  t.ok(c);
  t.equal(c.type, '2.16.840.1.113730.3.4.2');
  t.ok(c.criticality);
  t.end();
});


test('parse', function(t) {
  var ber = new BerWriter();
  ber.startSequence();
  ber.writeString('2.16.840.1.113730.3.4.2');
  ber.writeBoolean(true);
  ber.writeString('foo');
  ber.endSequence();

  var c = new Control();
  t.ok(c);
  t.ok(c.parse(new BerReader(ber.buffer)));

  t.ok(c);
  t.equal(c.type, '2.16.840.1.113730.3.4.2');
  t.ok(c.criticality);
  t.equal(c.value, 'foo');
  t.end();
});
