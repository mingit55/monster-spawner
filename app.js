/**
 * 상수 설정
 */
const SPEED_BAL = 55; // 속도 보정 값 ( 실게임과 비율을 맞추기 위함 )
const PLAYER_DELAY = 0.15; // 플레이어의 공격 딜레이 ( 공격 애니메이션 지속 시간 )

/**
 * Document Object Model
 */

const DOM = {
    // Side-bar
    monster_list : () => document.querySelector("#side-bar > .list"),

    // INPUT
    music_input : () => document.querySelector("#music-input"),
    speed_input : () => document.querySelector("#monster-speed"),
    time_input : () => document.querySelector("#time-input"),
    volume_input : () => document.querySelector("#volume-input"),

    // Button
    play_button: () => document.querySelector("#m-control > .play"),
    pause_button: () => document.querySelector("#m-control > .pause"),
    reset_button: () => document.querySelector("#reset-btn"),
    xml_parse: () => document.querySelector("#parse-xml"),
    xml_upload: () => document.querySelector("#input-xml"),

    // Common
    play_time: () => document.querySelector("#play-time"),
    audio_box: () => document.querySelector("#audio"),
    filename: () => document.querySelector("#filename"),
    mute: () => document.querySelector("#mute-btn"),

    // Actions
    create: (text, parentElem = "div") => {
        let parent = document.createElement(parentElem);
        parent.innerHTML = text;
        return parent.firstChild;
    }
};

const audio = document.createElement("audio");
audio.setAttribute("preload", "metadata");
audio.volume = DOM.volume_input().value;
audio.onloadedmetadata = function(){
    DOM.time_input().setAttribute("max", parseInt(audio.duration));
};


/**
 * Canvas Screen
 */
const screenElem = document.querySelector("#screen");
const ctx = screenElem.getContext('2d');




/**
 * 초기 설정
 */

const attackarea = new Image();
const monsterImage = new Image();
let player;

async function init(){
    DOM.audio_box().append(audio);
    monsterImage.src = "images/monster.png";
    attackarea.src = "images/attackarea.png";

    monsterImage.onload = await function(){
        return new Promise(resolve => {
            player = { image: new Image(), x: screenElem.width / 2 - monsterImage.width / 2 , y : screenElem.height / 2 - monsterImage.height / 2};
            player.image.src = "images/player.png";
            player.onload = function(){
                resolve();
            }
        });
    };

}


/*
 * 헬퍼 함수
 */

 function secToTime(second){
    second = parseInt(second);
    hour = parseInt(second / 3600);
    hour = hour > 0 ? hour + ":" : "";
    min = parseInt(second % 3600 / 60);
    min = min < 10 ? "0" + min : min;
    sec = parseInt(second % 60);
    sec = sec < 10 ? "0" + sec : sec;
    return hour + min + ":" + sec;
 }

 function parseArrow(no){
    if( no === 8 ) return '↑';
    else if( no === 4 ) return '←';
    else if( no === 6 ) return '→';
    else if( no === 2 ) return '↓';
 }

// 방향에 따라 플레이어의 위치 구함
 function dirToDis(direction){
     return direction === 8 || direction === 2 ? screenElem.height / 2 - monsterImage.height / 2 : screenElem.width / 2 - monsterImage.width / 2;
 }



/*
 * 몬스터 생성기
 */

 let monsterList = [];
 function Monster(direction, speed = null, delay = null){
    // 몬스터가 나오는 방향
    this.direction = parseInt(direction);
    // 1초당 움직이는 픽셀 수 ( SPEED_BAL 상수의 영향을 받음 )
    this.speed = speed === null ? parseInt(DOM.speed_input().value) : speed;
    // 몬스터가 생성되기 시작하는 시간
    this.createTime = delay === null ? audio.currentTime : (monsterList.length > 0 ? parseFloat(monsterList[monsterList.length-1].createTime + delay) : delay );
    this.createTime = parseFloat(this.createTime.toFixed(3));

    // 이전 몬스터 이후 나올 때까지 기다리는 시간
    this.delay = delay === null ? (monsterList.find(x => x.createTime <= this.createTime) ? parseFloat((this.createTime - monsterList.filter(x => x.createTime <= this.createTime).map(x => x.createTime).reduce((a, x) => Math.max(a, x))).toFixed(3)) : this.createTime) : delay;

    // 몬스터가 플레이어에게 도착하기까지 걸리는 시간
    this.arriveTime = dirToDis(this.direction) / (this.speed * SPEED_BAL) + this.createTime;
    let overlap = monsterList.filter( x => x.arriveTime >= this.arriveTime - PLAYER_DELAY && x.arriveTime <= this.arriveTime + PLAYER_DELAY );
     overlap.forEach(x => {
        x.elem.classList.add("error");
     });


    this.x = direction === 8 || direction === 2 ? screenElem.width / 2 - monsterImage.width / 2 : ( direction === 4 ? 0 : screenElem.width - monsterImage.width);
    this.y = direction === 4 || direction === 6 ? screenElem.height / 2 - monsterImage.height / 2 : ( direction === 8 ? 0 : screenElem.height - monsterImage.height ) ;
    this.index = monsterList.length > 0 ? monsterList[monsterList.length - 1].index + 1 : 1;

    // HTML 추가
    let text = `<div class="item" data-idx="${this.index}">
                    <div>
                        <span><b class="name">슬라임</b></span>
                        <span>${secToTime(this.createTime)}</span>
                    </div>
                    <div>
                        <span>속도: <input type="number" class="speed" value="${this.speed}" style="width: 30px;">px/s</span>
                        <span>딜레이: <b class="delay">${this.delay}</b>초</span>
                        <span>방향: <b class="direction">${parseArrow(this.direction)}</b></span>
                    </div>
                    <button class="close">&times;</button>
                </div>`;
    this.elem = DOM.create(text);
    // -  몬스터 + HTML 삭제
     this.elem.addEventListener("click", function(e){
        let target = e.target;
        if (target.classList.contains("close")) return false;
        while (!target.classList.contains("item")) {
            target = target.parentElement;
        }
        let fx= monsterList.find(x => x.index === parseInt(target.dataset.idx));
        audio.currentTime =  fx.createTime;
     });
    this.elem.querySelector(".close").addEventListener("click", function(){
        let index = monsterList.findIndex(x => x.index === parseInt(this.parentElement.dataset.idx));
        let target = monsterList[index];

        let next = monsterList.find( x => x.createTime > target.createTime);
        if(next) next.set("delay", parseFloat(next.delay + target.delay).toFixed(3));
        
        monsterList[index].elem.remove();
        monsterList.splice(index, 1);
    });

    const changeTrigger = function(e){
        let index = e.target.parentElement.parentElement.parentElement.dataset.idx / 1;
        let monster = monsterList.find(x => x.index === index);
        monster.set("speed", parseFloat(e.target.value));
    };
    this.elem.querySelector(".speed").addEventListener("change", changeTrigger);
    this.elem.querySelector(".speed").addEventListener("keydown", changeTrigger);
    this.elem.querySelector(".speed").addEventListener("mousedown", changeTrigger);



    let fx = monsterList.find(x => x.createTime > this.createTime );
    let msg = DOM.monster_list().querySelector("p");
    if( msg ) msg.remove();
    if(fx)  DOM.monster_list().insertBefore(this.elem, fx.elem);
    else DOM.monster_list().append(this.elem);
    DOM.monster_list().scrollTop = this.elem.offsetTop - 50;
 }

 Monster.prototype.set = function(prop, value){
     let edits = ['speed', 'delay', 'direction', 'name'];
     this[prop] = value;
     if(edits.indexOf(prop) >= 0) {
         if(prop === 'direction') this.elem.querySelector("." + prop).innerText = parseArrow(value);
         if(prop === "speed") this.elem.querySelector("." + prop).value = value;
         else this.elem.querySelector("." + prop).innerText = value;
     }
 };
 Monster.prototype.move = function(distance){
     distance = parseFloat(distance);
     if (this.direction === 8) this.y = distance;
     else if (this.direction === 2) this.y = screenElem.height - distance;
     else if (this.direction === 4) this.x = distance;
     else if (this.direction === 6) this.x = screenElem.width - distance;
     ctx.drawImage(monsterImage, this.x, this.y);
 };


/**
 * 이벤트 트리거
 */
function eventTrigger(){
    let isClicked = false; // Time-bar 가 클릭되었는 지 여부

    /**
     * Window
     */
    window.addEventListener("keydown", e => {
        /*
        Ctrl key Press
         */
        if(e.ctrlKey){
            if( e.keyCode === 37 && audio.currentTime ){
                e.preventDefault();
                audio.currentTime -= 5;
            }
            else if( e.keyCode === 39 && audio.currentTime ){
                e.preventDefault();
                audio.currentTime += 5;
            }
        }

        /*
        No - Ctrl key Press
         */
        else {
            // Space-bar
            if(e.keyCode === 32) {
                if(audio.paused && audio.src !== "") {
                    e.preventDefault();
                    DOM.pause_button().classList.remove("hidden");
                    DOM.play_button().classList.add("hidden");
                    audio.play();
                }
                else {
                    e.preventDefault();
                    DOM.play_button().classList.remove("hidden");
                    DOM.pause_button().classList.add("hidden");
                    audio.pause();
                }
            }

            else if(audio.currentTime)
            {
                // Arrow-key
                // ↑ (방향키 위쪽)
                if( e.keyCode === 38 ) {
                    e.preventDefault();
                    let monster = new Monster(8);
                    let fx = monsterList.findIndex(x => x.createTime > monster.createTime);
                    if(fx >= 0){
                        monsterList[fx].set('delay', parseFloat((monsterList[fx].delay / 1 - monster.delay / 1).toFixed(3)));
                        monsterList.splice(fx, 0, monster);
                    }
                    else monsterList.push(monster);
                    let prev = monsterList.indexOf(monster)-1;
                    if( prev >= 0 && monster.createTime - monsterList[prev].createTime < PLAYER_DELAY){
                        monster.elem.classList.add("error");
                    }
                }

                // ← (방향키 왼쪽)
                else if( e.keyCode === 37 ){
                    e.preventDefault();
                    let monster = new Monster(4);
                    let fx = monsterList.sort((a, b) =>  a.createTime <= b.createTime ).findIndex(x => x.createTime > monster.createTime);
                    if(fx >= 0){
                        monsterList[fx].set('delay', parseFloat((monsterList[fx].delay / 1 - monster.delay / 1).toFixed(3)));
                        monsterList.splice(fx, 0, monster);
                    }
                    else monsterList.push(monster);
                    let prev = monsterList.indexOf(monster)-1;
                    if( prev >= 0 && monster.createTime - monsterList[prev].createTime < PLAYER_DELAY){
                        monster.elem.classList.add("error");
                    }
                }

                // ↓ (방향키 아래쪽)
                else if( e.keyCode === 40 ){
                    e.preventDefault();
                    let monster = new Monster(2);
                    let fx = monsterList.sort((a, b) =>  a.createTime <= b.createTime ).findIndex(x => x.createTime > monster.createTime);
                    if(fx >= 0){
                        monsterList[fx].set('delay', parseFloat((monsterList[fx].delay / 1 - monster.delay / 1).toFixed(3)));
                        monsterList.splice(fx, 0, monster);
                    }
                    else monsterList.push(monster);
                    let prev = monsterList.indexOf(monster)-1;
                    if( prev >= 0 && monster.createTime - monsterList[prev].createTime < PLAYER_DELAY){
                        monster.elem.classList.add("error");
                    }
                }

                // → (방향키 오른쪽)
                else if( e.keyCode === 39 ){
                    e.preventDefault();
                    let monster = new Monster(6);
                    let fx = monsterList.sort((a, b) =>  a.createTime <= b.createTime ).findIndex(x => x.createTime > monster.createTime);
                    if(fx >= 0){
                        monsterList[fx].set('delay', parseFloat((monsterList[fx].delay / 1 - monster.delay / 1).toFixed(3)));
                        monsterList.splice(fx, 0, monster);
                    }
                    else monsterList.push(monster);
                    let prev = monsterList.indexOf(monster)-1;
                    if( prev >= 0 && monster.createTime - monsterList[prev].createTime < PLAYER_DELAY){
                        monster.elem.classList.add("error");
                    }
                }

                // 숫자(1~9) 49 ~ 57
                else if( e.keyCode >= 49 && e.keyCode <= 57 ){
                    e.preventDefault();
                    if( e.keyCode === 49 ) DOM.speed_input().value = 1;
                    else if( e.keyCode === 50 ) DOM.speed_input().value = 2;
                    else if( e.keyCode === 51 ) DOM.speed_input().value = 3;
                    else if( e.keyCode === 52 ) DOM.speed_input().value = 4;
                    else if( e.keyCode === 53 ) DOM.speed_input().value = 5;
                    else if( e.keyCode === 54 ) DOM.speed_input().value = 6;
                    else if( e.keyCode === 55 ) DOM.speed_input().value = 7;
                    else if( e.keyCode === 56 ) DOM.speed_input().value = 8;
                    else if( e.keyCode === 57 ) DOM.speed_input().value = 9;
                }
            }
        }

    });


    /**
     * Audio
     */

    audio.addEventListener("timeupdate", e => {
        let current = parseInt(e.target.currentTime);
        DOM.play_time().innerText = secToTime(e.target.currentTime);

        if(current !== e.target.value && !isClicked){
            DOM.time_input().value = current;
        }
    });

    /**
     * INPUT
     */
    // 음악 파일 INPUT
    DOM.music_input().addEventListener("change", e => {
        let file = e.target.files[0];
        if(!file.name) return alert("파일을 업로드 해주세요!");
        DOM.filename().value = file.name;

        // 파일 주소 가져오기
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(){
            monsterList = [];
            DOM.monster_list().innerHTML = '';
            audio.setAttribute("src", reader.result);
            DOM.time_input().value = 0;
            DOM.play_button().classList.remove("disabled");
            DOM.pause_button().classList.remove("disabled");
            DOM.pause_button().classList.add("hidden");
            DOM.play_button().classList.remove("hidden");
        };
    });

    // 시간 조절 바
    DOM.time_input().addEventListener("mousedown", e => {
        audio.play();
        isClicked = true;
    });
    DOM.time_input().addEventListener("mouseup", e => isClicked = false);
    DOM.time_input().addEventListener("change", e => {
        audio.currentTime = e.target.value;
        audio.play();
    });

    // 음향 조절 바
    DOM.volume_input().addEventListener("change", function(e){
        const value = parseFloat(e.target.value);
        const soundIcon = DOM.mute().querySelector("i");
        if( value > 0.5 ) {
            soundIcon.classList.remove("fa-volume-off", "fa-volume-down");
            soundIcon.classList.add("fa-volume-up");
        }
        else if ( value > 0 ) {
            soundIcon.classList.remove("fa-volume-off", "fa-volume-up");
            soundIcon.classList.add("fa-volume-down");
        }
        else {
            soundIcon.classList.remove("fa-volume-down", "fa-volume-up");
            soundIcon.classList.add("fa-volume-off");
        }

        audio.muted = false;
        audio.volume = e.target.value;
    });

    /**
     * 버튼
     */
    // 재생 버튼
    DOM.play_button().addEventListener("click", e => {
        if(e.target.classList.contains("disabled") || audio.src.length === 0){
            return false;
        }
        audio.play();
        e.target.classList.add("hidden");
        DOM.pause_button().classList.remove("hidden");

    });

    //일시정지 버튼
    DOM.pause_button().addEventListener("click", e => {
        if(e.target.classList.contains("disabled") || audio.src.length === 0){
            return false;
        }
        audio.pause();
        e.target.classList.add("hidden");
        DOM.play_button().classList.remove("hidden");
    });

    // 몬스터 리스트 리셋 버튼
    DOM.reset_button().addEventListener("click", e => {
        monsterList = [];
        DOM.monster_list().innerHTML = '<p class="text-center">음악을 삽입하고 방향키 입력을 통해<br>몬스터를 생성해 보세요!</p>';
        audio.currentTime = 0;
        DOM.time_input().value = 0;
        DOM.pause_button().click();
    });

    // XML 파싱 버튼
    DOM.xml_parse().addEventListener("click", e => {
        console.log(DOM.monster_list().querySelector(".item.error"));
        if(DOM.monster_list().querySelector(".item.error") && !confirm("플레이 하기 어려운 몬스터가 포함되어 있습니다. 이대로 진행하시겠습니까?")) return;
        if(monsterList.length > 0){
            let textarea = document.createElement("textarea");
            let text = `<?xml version=""1.0"" encoding=""UTF-8"" standalone=""yes""?>`;
            text += "<ROOT>";
            monsterList.forEach(x => {
                text += `<pattern direction=""${x.direction}"" speed=""${x.speed}"" delay=""${x.delay}"" />`;
            });
            text += "</ROOT>";
            textarea.value = text;
            document.body.append(textarea);
            textarea.select();
            document.execCommand("copy");
            textarea.remove();
            alert("XML이 복사되었습니다.");
        }
        else alert("생성된 몬스터가 없습니다.");
    });

    // XML 업로드 버튼
    DOM.xml_upload().addEventListener("click", e => {
        let text = prompt("XML 데이터를 입력해 주세요");
        if(text.trim() === "") return alert("데이터를 입력하세요.");
        text = text.replace(new RegExp("\"\"", "g"), "\"");
        let xmlRegex = new RegExp("<pattern\\sdirection=\"([0-9]+)\"\\sspeed=\"([0-9]+)\"\\sdelay=\"([0-9]+\\.[0-9]+)\"\\s\\/>", "g");
        let directionExp = new RegExp("direction=\"([0-9]+)\"");
        let speedExp = new RegExp("speed=\"([0-9]+)\"");
        let delayExp = new RegExp("delay=\"([0-9\.]+)\"");


        let matches = text.match(xmlRegex);
        if(typeof matches !== "Object" && matches.length === 0) return alert("올바른 데이터를 입력해 주십시오!");
        matches.forEach(x => {
            let dir = x.match(directionExp);
            if(!dir[1]) return alert("몬스터가 스폰될 방향이 존재하지 않습니다.");
            dir = dir[1];

            let speed = x.match(speedExp);
            if(!speed[1]) return alert("몬스터의 속도가 존재하지 않습니다.");
            speed = speed[1];

            let delay = x.match(delayExp);
            if(!delay[1]) return alert("몬스터의 딜레이가 존재하지 않습니다.");
            delay = delay[1];

            monsterList.push(new Monster(parseInt(dir), parseInt(speed), parseFloat(delay)));
        });
    });

    // 음소거 버튼
    DOM.mute().addEventListener("click", function(e){
        const icon = e.target.querySelector("i");
        if(audio.muted){
            audio.muted = !audio.muted;
            DOM.volume_input().value = audio.volume;
            if( audio.volume > 0.5 ) {
                icon.classList.remove("fa-volume-off", "fa-volume-down");
                icon.classList.add("fa-volume-up");
            }
            else if ( audio.volume > 0 ) {
                icon.classList.remove("fa-volume-off", "fa-volume-up");
                icon.classList.add("fa-volume-down");
            }
            else {
                icon.classList.remove("fa-volume-down", "fa-volume-up");
                icon.classList.add("fa-volume-off");
            }
        }
        else {
            audio.muted = !audio.muted;
            DOM.volume_input().value = 0;
            icon.classList.remove("fa-volume-up", "fa-volume-down");
            icon.classList.add("fa-volume-off");
        }

    });
}


/**
 * Window onload
 */
window.onload = async function(){
    await init();
    eventTrigger();
    setInterval(function rendering(){
        if(!audio.paused){
            ctx.clearRect(0, 0, screenElem.width, screenElem.height);
            ctx.drawImage(attackarea, screenElem.width / 2 - attackarea.width / 2, screenElem.height / 2 - attackarea.height / 2);
            monsterList.forEach(x => {
                let lastTime = audio.currentTime - x.createTime; // 해당 몬스터가 출현하고서 지난 시간
                let moveTo = lastTime * x.speed * SPEED_BAL;
                if(moveTo >= 0 && moveTo <= dirToDis(x.direction)){
                    x.move(moveTo);
                    x.elem.classList.add("active");
                    DOM.monster_list().scrollTop = x.elem.offsetTop - 50;
                }
                else {
                    x.elem.classList.remove("active");
                }
            });
            ctx.drawImage(player.image, screenElem.width / 2 - player.image.width / 2, screenElem.height / 2 - player.image.height / 2);
        }
    }, 10);
};