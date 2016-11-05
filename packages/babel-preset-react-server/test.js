import test from 'ava';
import fs from 'fs';
import { transform } from 'babel-core';

test('module can be required', t => {
	try {
		require('.');
		t.pass();
	} catch (e) {
		console.error(e);
		t.fail();
	}
});

test('transpiles as expected', async t => {
	const source = await readFile('tst/source.js');
	const actual = transform(source, { presets: [require('.')] }).code;
	const expected = await readFile('tst/expected.js');

	t.is(normalizeWhitespace(actual), normalizeWhitespace(expected));
});

function readFile(filename) {
	return new Promise((resolve, reject) => {
		fs.readFile(filename, (err, data) => {
			if (err) {
				console.error(err);
				reject(err);
			} else {
				resolve(data.toString());
			}
		});
	});
}

function normalizeWhitespace(str) {
	return str
		.replace(/^\s+|\s+$/g, '')
		.replace(/\r/g, '');
}

