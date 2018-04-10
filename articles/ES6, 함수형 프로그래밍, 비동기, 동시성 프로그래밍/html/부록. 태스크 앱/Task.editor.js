!function() {
  Task.editor = {};

  const tmpl = _ => `
    <div class="page editor">
      <div class="container">
        <div class="header">
          <h1>태스크 만들기</h1>
          <div class="options">
            <button type="button" class="cancel left">취소</button>
            <button type="button" class="save right">저장</button>
          </div>
        </div>
        <div class="body">
          <div class="name"><input type="text" placeholder="작업명"></div>
          <div class="description"><textarea placeholder="추가 설명"></textarea></div>
          <div class="status">
            <select>
              <option value="READY">진행전</option>
              <option value="ON">진행중</option>
              <option value="DONE">완료</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  `;

  Task.editor.show = _ => new Promise(resolve => go(_,
    tmpl,
    $.el,
    $.append($('#task')),
    $.on('click', '.options .cancel', e => {
      $.remove(e.delegateTarget);
      resolve();
    }),
    $.on('click', '.options .save', e => {
      $.remove(e.delegateTarget);
      resolve({
        name: go(e.delegateTarget, $.find('.name input'), $.val),
        description: go(e.delegateTarget, $.find('.description textarea'), $.val),
        status: go(e.delegateTarget, $.find('.status select'), $.val)
      });
    }),
    $.animate({ top: 0, opacity: 1 }),
    $.find('.name input'),
    $.focus
  ));

} ();
