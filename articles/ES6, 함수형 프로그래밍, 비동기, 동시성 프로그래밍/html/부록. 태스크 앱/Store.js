const Store = {};

Store.getUsers = _ => new Promise(resolve =>
  setTimeout(function() {
    resolve([
      { id: 1, name: 'ID' },
      { id: 2, name: 'VX' },
      { id: 3, name: 'YB' },
      { id: 4, name: 'MD' }
    ]);
  }, 1000)
);