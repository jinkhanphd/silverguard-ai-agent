(function (root) {
  "use strict";

  const KEY = "silverguard_events_v10";
  let events = [];

  function load() {
    try { events = JSON.parse(localStorage.getItem(KEY) || "[]"); }
    catch (_) { events = []; }
    return events;
  }

  function all() { return events; }

  function saveEvent(event) {
    events.unshift(event);
    persist();
    return event;
  }

  function updateEvent(id, patch) {
    const target = events.find(e => e.id === id);
    if (!target) return null;
    Object.assign(target, patch);
    persist();
    return target;
  }

  function clear() {
    events = [];
    persist();
  }

  function persist() {
    localStorage.setItem(KEY, JSON.stringify(events));
  }

  root.SilverGuardStorage = { KEY, load, all, saveEvent, updateEvent, clear };
})(globalThis);
