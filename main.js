//유저가 값을 입력한다
// + 버튼을 클릭하면 할 일이 추가된다
// delete 버튼을 누르면 할 일이 삭제된다
// check 버튼을 누르면 할 일이 끝나면서 취소선 생김
// 1. check 버튼을 클릭하는 순간 false >> true로
// 2. true이면 끝난 걸로 간주하고 밑줄 보여주기
// 3. false이면 안 끝난 걸로 간주하고 그대로

// 진행 중 끝남 탭을 누르면, 언더바가 이동한다
// 끝남탭은, 끝난 아이템만, 진행 중 탭은 진행 중인 아이템만 나옴
// 전체 탭을 누르면 다시 전체 아이템으로 돌아옴

//과제: 메뉴 슬라이드 바
//모두 탭뿐만 아니라 진행 중, 끝남 탭에서도 삭제 or 체크되도록 하기
//투두앱 예쁘게 디자인하기

let taskInput = document.getElementById('task-input');
let addButton = document.getElementById('add-button');
let taskList = []; //할 일을 추가할 배열
let tabs = document.querySelectorAll('.task-tabs div'); //task-tabs 아래에 있는 div를 다 가져옴
let mode = 'all'; //처음 값은 항상 '모두 탭'이므로 초기값 설정 또한 all로 함
let filterList = [];
let underLine = document.getElementById('under-line');
addButton.addEventListener('click', addTask);

//click 이벤트를 주고 싶은 건 인덱스 1부터 시작
for (let i = 1; i < tabs.length; i++) {
  //event 태그 주고 넘기기 (tab 같은 경우 내가 무슨 탭을 선택했는지 알아야 하기 때문)
  tabs[i].addEventListener('click', function (event) {
    filter(event);
  });
}

function addTask() {
  //유저가 입력한 값 taskContent 변수에 담음
  //let taskContent = taskInput.value; 객체를 정의해서 필요없어짐
  let task = {
    //각각의 아이템에 id 부여 (유일한 값이어야 함)
    id: randomIDGenerate(), //함수 호출
    taskContent: taskInput.value,
    isComplete: false, //끝났는지 물어보는 것
  }; //객체임: 관련있는 정보를 하나로 묶어 줌
  //할 일을 추가할 배열에 유저가 입력한 값 저장
  taskList.push(task);
  console.log(task);
  render();
}

//그림을 그려 주는 건 render로 처리 (UI 담당)
function render() {
  //taskList만 그리고 있기 때문에
  // 내가 선택한 탭에 따라서
  let list = []; //상황에 따라 값을 넣어 줄 것
  if (mode === 'all') {
    // 만약 all 선택 >> taskList
    list = taskList;
  } else if (mode === 'ongoing' || mode === 'done') {
    // ongoing or done 선택 >> filterList
    list = filterList;
  }
  //리스트를 달리 보여 줘야 함 >> mode가 들고 있는 값

  let resultHTML = '';
  for (let i = 0; i < list.length; i++) {
    //객체 정의로 인해 할 일 목록에 object로만 출력되므로, list의 taskContent를 출력한다고 지정해 줘야 함
    //taskList를 전부 list로
    //각각 아이템에 아이디 값을 넣어 줌
    // >> toggleComplete라는 함수가 실행될 때마다 클릭된 아이템의 아이디 값을 넣어 주는 것

    //만약 taskList의 i번째에 있는 아이템의 isComplete이 true라면
    if (list[i].isComplete == true) {
      //resultHTML에 완료를 알 수 있는 줄을 긋기 위한 스타일 추가
      resultHTML += `<div class="task">
            <div class='task-done'>${list[i].taskContent}</div>
            <div>
              <button onclick="toggleComplete('${list[i].id}')" class="checkbtn">완료</button>
              <button onclick="deleteTask('${list[i].id}')" class="deletebtn">삭제</button>
            </div>
          </div>`;
    } else {
      //false라면
      resultHTML += `<div class="task">
            <div>${list[i].taskContent}</div>
            <div>
              <button onclick="toggleComplete('${list[i].id}')" class="checkbtn">체크</button>
              <button onclick="deleteTask('${list[i].id}')" class="deletebtn">삭제</button>
            </div>
          </div>`;
    } //button에 click 이벤트를 주는 2가지 방식
    // 1. addEventListener()를 통해
    // 2. onclick 이벤트로 버튼에다 직접적으로 주는 방법 (함수 넣어 주면 됨!!)
  }
  // task-board에 resultHTML을 붙여넣을 것(innerHTML)
  document.getElementById('task-board').innerHTML = resultHTML;
}

function toggleComplete(id) {
  //어떤 아이템을 선택했는지 알려 줘야 함
  //모든 아이템에도 id가 필요 >> 아이템을 개개인으로 분리해서 볼 수 있음

  //아이디 값을 베이스로 아이템 찾기
  for (let i = 0; i < taskList.length; i++) {
    //만약 taskList의 i번째에 있는 아이템의 아이디가 매개변수로 받은 아이디와 같다면
    if (taskList[i].id == id) {
      //taskList의 i번째에 있는 아이템에 isComplete의 값을 true로 바꿈
      //taskList[i].isComplete = true; >> true/false 값을 자유자재로 바꾸려면
      //현재 갖고 있는 값의 반대 값을 넣어 줌
      taskList[i].isComplete = !taskList[i].isComplete;
      break; //아이템 하나 찾았으면 더 이상 찾을 필요 없으므로 종료
    }
  }
  render();
  console.log(taskList);
}

function deleteTask(id) {
  //array에 있는 아이템 삭제 방법 splice(시작점, 몇 개의 아이템)
  //인덱스 값을 알아야 함
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList.splice(i, 1); //i번째에 있는 아이템 하나만 삭제
      break;
    }
  }
  render(); //값의 업데이트가 있으면 ui도 업데이트 해 줘야
  console.log(taskList);
}

//매개변수로 받는 event: 내가 뭘 클릭했는지에 대한 정보를 가지고 있음
function filter(event) {
  //event.target : event에서 내가 타겟한 게 무엇인지 알려 줌 (태그 전체를 들고 옴)
  //event.target.id : 타겟의 아이디 값만 들고 올 수 있음
  /*let*/ mode = event.target.id; //render()에서도 써야 해서 지역 변수 X, 전역 변수로 선언해 줘야 함
  /*let*/ filterList = []; //filter된 리스트 생성 (지역 변수이기 때문에 전역 변수로 변경)

  if (mode === 'all') {
    //전체 리스트 보여 줌
    render();
  } else if (mode === 'ongoing') {
    //진행 중인 아이템 보여 줌
    //각각의 task의 isComplete가 false인 값 == 진행 중
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete === false) {
        filterList.push(taskList[i]); //진행 중인 아이템 모아두기
      }
    }
    render();
    console.log('진행 중', filterList);
  } else if (mode === 'done') {
    //끝나는 케이스
    //task.isComplete === true
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete === true) {
        filterList.push(taskList[i]);
      }
    }
  }
  render();
}

//이 함수를 호출하면 랜덤 id가 생성됨
function randomIDGenerate() {
  return Math.random().toString(36).substr(2, 16);
}
