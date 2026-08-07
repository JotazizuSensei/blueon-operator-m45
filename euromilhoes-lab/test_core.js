const assert=require('assert');
const C=require('./core.js');

assert.equal(C.validLine([7,19,32,42,46],[3,11]),true);
assert.equal(C.validLine([7,7,32,42,46],[3,11]),false);
const h=C.hits({drawDate:'2026-08-04',numbers:[7,19,32,42,46],stars:[3,11]},{date:'2026-08-04',numbers:[25,30,34,46,50],stars:[1,12],m1:''});
assert.deepEqual(h,{n:1,s:0,m1:false});
assert.equal(C.category(h),'Sem prémio');
assert.equal(Math.round(C.oddsForLines(5)),27967632);
const lines=C.generateBest({existing:[{numbers:[7,19,32,42,46],stars:[3,11]}],count:20,mode:'diversified',tries:250});
assert.equal(lines.length,20);
assert.equal(new Set(lines.map(C.lineKey)).size,20);
assert(lines.every(l=>C.validLine(l.numbers,l.stars)));
assert(!lines.some(l=>C.lineKey(l)==='7-19-32-42-46|3-11'));
assert.equal(C.nextDrawISO(new Date('2026-08-07T09:00:00Z')),'2026-08-07');
assert.equal(C.nextDrawISO(new Date('2026-08-07T19:30:00Z')),'2026-08-11');
console.log('CORE_TESTS_OK');
