"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function* objectIterator(obj, entries = false) {
  const keys = Object.keys(obj);

  for (const key of keys) {
    const value = obj[key];

    yield entries ? [key, value] : value;
  }
}

const entries = obj => objectIterator(obj, true);

exports.entries = entries;
exports.default = objectIterator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9vY3RldHN0cmVhbS9wcm9qZWN0cy90d2kvc3JjL3NlcnZlci9jb3JlL2hlbHBlci91dGlsL29iamVjdEl0ZXJhdG9yLmpzIl0sIm5hbWVzIjpbIm9iamVjdEl0ZXJhdG9yIiwib2JqIiwiZW50cmllcyIsImtleXMiLCJPYmplY3QiLCJrZXkiLCJ2YWx1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxVQUFVQSxjQUFWLENBQXlCQyxHQUF6QixFQUE4QkMsVUFBVSxLQUF4QyxFQUErQztBQUM3QyxRQUFNQyxPQUFPQyxPQUFPRCxJQUFQLENBQVlGLEdBQVosQ0FBYjs7QUFFQSxPQUFLLE1BQU1JLEdBQVgsSUFBa0JGLElBQWxCLEVBQXdCO0FBQ3RCLFVBQU1HLFFBQVFMLElBQUlJLEdBQUosQ0FBZDs7QUFFQSxVQUFNSCxVQUFVLENBQUNHLEdBQUQsRUFBTUMsS0FBTixDQUFWLEdBQXlCQSxLQUEvQjtBQUNEO0FBQ0Y7O0FBRUQsTUFBTUosVUFBVUQsT0FBT0QsZUFBZUMsR0FBZixFQUFvQixJQUFwQixDQUF2Qjs7UUFFUUMsTyxHQUFBQSxPO2tCQUNPRixjIiwiZmlsZSI6Ii9Vc2Vycy9vY3RldHN0cmVhbS9wcm9qZWN0cy90d2kvc3JjL3NlcnZlci9jb3JlL2hlbHBlci91dGlsL29iamVjdEl0ZXJhdG9yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24qIG9iamVjdEl0ZXJhdG9yKG9iaiwgZW50cmllcyA9IGZhbHNlKSB7XG4gIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopXG5cbiAgZm9yIChjb25zdCBrZXkgb2Yga2V5cykge1xuICAgIGNvbnN0IHZhbHVlID0gb2JqW2tleV1cblxuICAgIHlpZWxkIGVudHJpZXMgPyBba2V5LCB2YWx1ZV0gOiB2YWx1ZVxuICB9XG59XG5cbmNvbnN0IGVudHJpZXMgPSBvYmogPT4gb2JqZWN0SXRlcmF0b3Iob2JqLCB0cnVlKVxuXG5leHBvcnQge2VudHJpZXN9XG5leHBvcnQgZGVmYXVsdCBvYmplY3RJdGVyYXRvclxuIl19