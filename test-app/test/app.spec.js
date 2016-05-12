function doGarbageCollection() {
  return browser.driver.executeScript(function() {
    return window.gc();
  });
}

function getMemoryUsage() {
  return browser.driver.executeScript(function() {
    return window.performance.memory;
  });
}

function diffMemoryUsage(before, after) {
  var diff = after.usedJSHeapSize - before.usedJSHeapSize;
  return diff / 1000000;
}

function runTest(testFn, done) {
  browser.sleep(1000)
  .then(function() {
    return doGarbageCollection();
  })
  .then(function() {
    return getMemoryUsage();
  })
  .then(function(beforeMem) {
    testFn(function() {
      browser.sleep(1000)
      .then(function() {
        return doGarbageCollection();
      })
      .then(function() {
        return getMemoryUsage();
      })
      .then(function(afterMem) {
        var leakedMem = diffMemoryUsage(beforeMem, afterMem);
        expect(leakedMem).toBeLessThan(1);
        done();
      });
    });
  });
}

describe('test-app', function() {
  it('should allocate memory faster than it frees it', function(done) {
    browser.get('http://localhost:8000/test-app/');

    runTest(function(done) {
      for (var i = 0; i < 50; i++) {
        element(by.buttonText('Allocate')).click();
        element(by.buttonText('Free')).click();
      }
      done();
    }, done);
  });
});
