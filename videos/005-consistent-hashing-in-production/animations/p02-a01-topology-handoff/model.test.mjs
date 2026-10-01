import test from "node:test";
import assert from "node:assert/strict";
import { canCleanup, phaseAt, routerState, timing } from "./model.ts";

test("prepare keeps both routers on the old topology until their own commit", () => {
  assert.equal(routerState(timing.barrier, 1), "prepared");
  assert.equal(routerState(timing.barrier, 2), "prepared");
  assert.ok(timing.copyDone < timing.commit1);
  assert.equal(routerState(timing.commit1 - 1, 1), "prepared");
});

test("a mixed topology retains the second queue and prevents cleanup", () => {
  for (const time of [timing.commit1, timing.wait, timing.commit2 - 1]) {
    assert.equal(routerState(time, 1), "committed");
    assert.equal(routerState(time, 2), "prepared");
    assert.equal(canCleanup(time), false);
  }
});

test("cleanup waits for both routers and an explicit cleanup phase", () => {
  assert.equal(routerState(timing.commit2, 2), "committed");
  assert.equal(canCleanup(timing.commit2), false);
  assert.equal(canCleanup(timing.cleanup), true);
  assert.ok(timing.evict > timing.cleanup);
});

test("backward scrubbing reconstructs earlier states without a persistent commit", () => {
  assert.equal(canCleanup(timing.resolved), true);
  assert.equal(routerState(timing.prepare, 1), "active");
  assert.equal(phaseAt(0).id, "overview");
  assert.equal(canCleanup(0), false);
});
