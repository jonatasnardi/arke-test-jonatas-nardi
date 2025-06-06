export function isJson(string: string) {
  if (!string) return false;
  if (/^[\],:{}\s]*$/.test(string.replace(/\\["\\\/bfnrtu]/g, '@').
    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
    return true;
  }

  return false;
}

export function createUniqueId(): string {
  return Math.random().toString(16).slice(2);
}