import { fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators'

describe('Async Testing – Microtasks (promises), macrotasks (DOM related), observables', () => {

  it('async example with Jasmine done()', (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      test = true;
      expect(test).toBeTruthy();
      done();
    }, 1000);
  });

  it('async example with fakeAsync and tick', fakeAsync(() => {
    let test = false;

    setTimeout(() => {
      test = true;
      //expect(test).toBeTruthy();
    }, 1000);

    // pushes time forward, alongside fakeAsync
    // without tick, timer is in the queue
    tick(1000);
    expect(test).toBeTruthy();
  }));

  it('async example with fakeAsync and flush', fakeAsync(() => {
    let test = false;

    setTimeout(() => {
      test = true;
      //expect(test).toBeTruthy();
    }, 1000);

    // all async operations must be completed to progress further
    flush();
    expect(test).toBeTruthy();
  }));

  it('async example of PLAIN PROMISE (microtasks)', fakeAsync(() => {
    let test = false;

    Promise.resolve().then(() => {
      test = true;
    });
    // Microtasks - promises, they do not change view (DOM) as micro/tasks (setInterval, setTimeout, click event etc.)
    flushMicrotasks();

    expect(test).toBeTrue();

  }));

  it('async example of PROMISE + SETTIMEOUT (micro and macro/tasks)', fakeAsync(() => {
    let counter = 0;

    Promise.resolve()
      .then(() => {
        counter += 10;
        setTimeout(() => {
          counter += 1;
        }, 1000);
      })

      expect(counter).toBe(0);
      flushMicrotasks();
      expect(counter).toBe(10);
      // either tick or flush for setTimeout
      // tick(1000);
      flush();
      expect(counter).toBe(11);
  }));

  it('async example of OBSERVABLES', fakeAsync(() => {
    let test = false;
    // const test$ = of(test); // simple synchronous observable, will work
    const test$ = of(test).pipe(delay(1000));
    test$.subscribe(() => {
      test = true;
    });
    tick(1000);
    expect(test).toBeTrue();
  }));

  /*
    fakeAsync vs. async
      // async does not allow to write tests in sync way as fakeAsync, whenStable cb used instead
      // no control over time passage, no control over micro/macrotasks, not written in sync way
      // fakeAsync does not support http requests, async does
      // async suitable in beforeEach (to perform http requests)

      // async usage with fixture in tests:
      fixture.whenStable().then(() => {
        // ... post async code
      });

      // async usage in beforeEach
      *TestBedConfig*.compileComponents()
          .then(() => {
            // ... post async code
          });
   */


});



