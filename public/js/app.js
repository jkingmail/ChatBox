class MessageBox {
  /**
   *
   * @param {用户名} user
   * @param {用户聊天信息} message
   * @param {发送信息时间} time
   * @param {不是我发送的信息} isNotMe
   */
  constructor(user, message, time, isNotMe = true) {
    this.user = user
    this.message = message
    this.time = time
    this.isNotMe = isNotMe
  }

  createHeadImg() {
    let head = document.createElement('div')
    head.innerText = this.user
    return head
  }

  createDivForInformation() {
    let div = document.createElement('div')
    div.append(this.createDivForTime())
    div.append(this.createDivFoeMessage())
    return div
  }

  createDivFoeMessage() {
    let div = document.createElement('div')
    div.innerText = this.message
    div.classList.add('info')
    return div
  }

  createDivForTime() {
    let div = document.createElement('div')
    div.classList.add('time')
    let time = document.createElement('span')
    time.innerText = this.time
    div.append(time)
    return div
  }

  createBox() {
    let box = document.createElement('div')
    box.classList.add('oneMessage')
    let whomeg = this.isNotMe ? 'orthersmessage' : 'mymessage'
    box.classList.add(whomeg)
    box.append(this.createHeadImg())
    box.append(this.createDivForInformation())
    return box
  }
}

function subMessageToBox(user, flag = false, time = null, info = null, callback) {
  let main = document.querySelector('.main')
  let text = document.querySelector('#text')
  let dialog = document.querySelector('.dialog')
  let now = null;
  if (time === null) {
    let time = new Date()
    now = `${time.getHours()}:${time.getMinutes()}`
  } else {
    now = time
  }
  //console.log(now)

  if (!flag) {  //是本地用户发的
    info = text.value
    if (info.length == 0) {
      alert('不能输入为空')
      return
    }
    let date = {
      user,
      now,
      info
    }
    let box = new MessageBox(user, info, now, flag)
    main.append(box.createBox())
    dialog.scrollTop = dialog.scrollHeight - dialog.clientHeight    //自己发送信息就跳到底端 //学qq的逻辑
    //console.log(callback)
    callback.sendOwnMessage(callback.ws, JSON.stringify(date, null, 4))
    /*
    if(judgeMainIsBottom()){    //添加之前，用户页面在底部自动锁定到底部
        main.append(box.createBox())
        dialog.scrollTop = dialog.scrollHeight - dialog.clientHeight
    }else{
        main.append(box.createBox())
    }
    */
    text.value = ""
  } else {
    let box = new MessageBox(user, info, now, flag)
    if (!judgeMainIsBottom()) {
      main.append(box.createBox())
      showNotifBox()
    } else {
      main.append(box.createBox())
      dialog.scrollTop = dialog.scrollHeight - dialog.clientHeight
    }
  }
}

function showNotifBox() {
  let box = document.querySelector('.notificationBox')
  let span = box.querySelector('span')
  let num = span.innerText
  num++
  span.innerText = num.toString()
  box.classList.add('active')

}

function clickToBottom() {
  let btn = document.querySelector('.notificationBox')
  let main = document.querySelector('.main')
  let dialog = document.querySelector('.dialog')
  let btnToBottom = document.querySelector('.toBottom')
  let lastoffesetY = 0;
  let showToBottomImg = true
  btn.addEventListener('click', () => {
    let length = dialog.scrollHeight - dialog.clientHeight
    showToBottomImg = false
    setTimeout(() => {
      dialog.scroll({top: length, behavior: 'smooth'})
      btn.querySelector('span').innerHTML = 0
      btn.classList.remove('active')
      btnToBottom.classList.remove('active')
      setTimeout(() => {
        showToBottomImg = true
      }, 1000)
    }, 100)
  })
  btnToBottom.addEventListener('click', () => {
    let length = dialog.scrollHeight - dialog.clientHeight
    showToBottomImg = false
    setTimeout(() => {
      dialog.scroll({top: length, behavior: 'smooth'})
      btn.querySelector('span').innerHTML = 0
      btnToBottom.classList.remove('active')
      btn.classList.remove('active')
      setTimeout(() => {
        showToBottomImg = true
        console.log(showToBottomImg)
      }, 1000)
    }, 100)
  })
  btnToBottom.addEventListener('mouseenter', () => {
    if (timeOut != null) {
      clearTimeout(timeOut)
      timeOut = null
    }
  })
  btnToBottom.addEventListener('mouseleave', () => {
    if (timeOut == null) {
      timeOut = setTimeout(() => {
        btnToBottom.classList.remove('active')
        timeOut = null
      }, 3500)
    }
  })
  let timeOut = null
  dialog.addEventListener('scroll', () => {
    if (judgeMainIsBottom()) {
      btn.querySelector('span').innerHTML = 0
      btn.classList.remove('active')
      btnToBottom.classList.remove('active')
    } else {
      let now = dialog.scrollTop
      if (dialog.scrollHeight - dialog.scrollTop > 2 * dialog.clientHeight) {
        //console.log(now)
        if (showToBottomImg && now - lastoffesetY > 20) {
          //console.log('快速下滑')
          btnToBottom.classList.add('active')
          if (timeOut != null) {
            clearTimeout(timeOut)
            timeOut = null
          }
          timeOut = setTimeout(() => {
            btnToBottom.classList.remove('active')
            timeOut = null
          }, 3500)
        }
      }
      lastoffesetY = now
    }
  })
}


function clickOrther() {
  let btn = document.getElementById("btn2");
  let info = `今天吃点啥？今天吃点啥？今天吃点啥？今天吃点啥？今天吃点啥？今天吃点啥？今天吃点啥？今天吃点啥？`
  btn.addEventListener('click', () => {
    subMessageToBox('天乐', true, '12:18', info)
  })
}

function clickBtnSub(callback) {
  let btn = document.getElementById("btn")
  let text = document.querySelector('#text')
  let userNameEle = document.querySelector("[name='username']")
  let userName = null
  btn.addEventListener('click', () => {
    userName = getName(userNameEle)
    if (userName === false) {
      alert('请输入用户名！')
      return;
    } else {
      userNameEle.setAttribute('disabled', 'true')
    }
    //console.log('user'+callback)
    subMessageToBox(userName, flag = false, time = null, info = null, callback)
  })
  text.addEventListener('keyup', (key) => {
    if (key.keyCode === 13 && key.ctrlKey) {
      userName = getName(userNameEle)
      if (userName === false) {
        alert('请输入用户名！')
        return;
      } else {
        userNameEle.setAttribute('disabled', 'true')
      }
      subMessageToBox(userName, flag = false, time = null, info = null, callback)
    }
  })
}

function getName(userNameEle) {
  let userName = userNameEle.value
  if (userName !== "") {
    return userName
  } else
    return false
}

function judgeMainIsBottom() {
  let dialog = document.querySelector('.dialog')
  //console.log(dialog)

  let allHigh = dialog.scrollHeight
  let top = dialog.scrollTop
  let viewHigh = dialog.clientHeight
  if (allHigh - top - viewHigh <= 100) {
    return true
  }
  return false
  //console.log(`allHigh:${allHigh},top:${top},viewHigh:${viewHigh}`)
}

class Socket {
  ws = null

  constructor() {
    this.ws = new WebSocket('ws://127.0.0.1:80')
    this.ws.onopen = function () {
      console.log('websocket Started')
    }
    this.ws.onclose = function () {
      console.log('连接关闭')
    }
  }

  getOrtherMessage() {
    console.log(this.ws)
    this.ws.onmessage = (msg) => {
      //console.log(msg)
      let date = JSON.parse(msg.data)
      console.log(date)
      if (date.code === 2){
        subMessageToBox(date.user, true, date.now, date.info)
      }
      else {
        console.log('信息发送成功 '+date.now)
      }
    }
  }

  sendOwnMessage(tws, date) {
    //console.log(date)
    tws.send(date)
  }
}

function run() {
  let socket = new Socket()
  socket.getOrtherMessage()
  clickBtnSub(socket)
  //ListenEnter()
  //clickOrther()
  clickToBottom()
}

run()