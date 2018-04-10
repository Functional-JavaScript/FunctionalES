!function () {
  Task.list = {};

  Task.item = {};

  Task.item.tmpl = task => `
    <li class="task item">
      <h3 class="name">${task.name}</h3>
      <div class="description">${task.description}</div>
    </li>
  `;

  Task.list.init = pipe(
    $.on('click', '.create', e =>
      match (Task.editor.show())
        .case(identity) (
          Task.item.tmpl,
          $.el,
          $.prepend($.find('ul.task_list', e.delegateTarget)))
        .else (noop)
    )
  );
} ();