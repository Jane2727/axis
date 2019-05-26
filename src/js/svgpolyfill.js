export default (() => {
  if (!('classList' in SVGElement.prototype)) {
    Object.defineProperty(SVGElement.prototype, 'classList', {
      get() {
        return {
          contains: className => {
            return this.className.baseVal.split(' ').indexOf(className) !== -1;
          },
          add: className => {
            return this.setAttribute('class', this.getAttribute('class') + ' ' + className);
          },
          remove: className => {
            var removedClass = this.getAttribute('class').replace(
              new RegExp('(\\s|^)' + className + '(\\s|$)', 'g'),
              '$2',
            );
            if (this.classList.contains(className)) {
              this.setAttribute('class', removedClass);
            }
          },
        };
      },
    });
  }
})();
