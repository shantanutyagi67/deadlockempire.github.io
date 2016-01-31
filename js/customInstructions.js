var MinorBecomesInconsistent = function(queue) {
    this.code = queue + " enters an inconsistent state.";
    this.execute = function (threadState, globalState) {
        if (globalState[queue].inconsistent) {
            win("Two threads entered a non-thread-safe function at the same time.");
        } else {

        }
        globalState[queue].inconsistent = true;
        moveToNextInstruction(threadState);
    };
};
var MinorEnqueue = function(queue) {
    this.code = queue + " gains a new element.";
    this.execute = function (threadState, globalState) {
        globalState[queue].value++;
        moveToNextInstruction(threadState);
    };
};
var MinorDequeue = function(queue) {
    this.code = queue + " loses an element.";
    this.execute = function (threadState, globalState) {
        if (globalState[queue].value <= 0) {
            win("An InvalidOperationException was raised when trying to read from an empty queue.")
        }
        else {
            globalState[queue].value--;
            moveToNextInstruction(threadState);
        }
    };
};
var QueueNotEmptyExpression = function(queue) {
    this.code = queue + ".Count > 0";
    this.evaluate = function (threadState, globalState) {
      if (globalState[queue].value > 0) {
          return true;
      }  else {
          return false;
      }
    };
};
var MinorBecomesConsistent = function(queue) {
    this.code = queue + " returns to a consistent state.";
    this.execute = function (threadState, globalState) {
        globalState[queue].inconsistent = false;
        moveToNextInstruction(threadState);
    };
};
var createEnqueueUnsafe = function(queue, number) {
    var minorInstructions = [
        new MinorBecomesInconsistent(queue),
        new MinorEnqueue(queue),
        new MinorBecomesConsistent(queue)
    ];
    var v = new ExpandableInstruction(queue + ".Enqueue(" + number + ");", minorInstructions);
    v.tooltip = "[Expandable] Adds an object to the end of the queue. This operation is not atomic nor thread-safe.";
    return v;
};
var createDequeueUnsafe = function(queue) {
    var minorInstructions = [
        new MinorBecomesInconsistent(queue),
        new MinorDequeue(queue),
        new MinorBecomesConsistent(queue)
    ];
    var v = new ExpandableInstruction(queue + ".Dequeue();", minorInstructions);
    v.tooltip = "[Expandable] Removes an object from the front of the queue. Raises an exception if the queue is empty. This operation is not atomic nor thread-safe.";
    return v;
};