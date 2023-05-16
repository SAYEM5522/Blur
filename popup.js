
const myCard = document.getElementById("my-card");
const myHome = document.getElementById("my-home");
const inputField = document.querySelector(".home_input");
const inputEmail = document.querySelector(".home_email");
const openButton = document.querySelector(".home_button");
const codeButton = document.querySelector(".get_button");
const AppsumoButton = document.querySelector(".home_input_appsumo");
const AppsumoOpenButton = document.querySelector(".home_button2");



codeButton.addEventListener("click", function() {
  chrome.tabs.create({ url: "https://buy.stripe.com/7sIeY0dY6fwt01y14d" });
  // window.location.replace("");
});

let open = false;
openButton.addEventListener("click", () => {
  const code = inputField.value;
  const email=inputEmail.value
  fetch('https://blurrifyco.onrender.com/allCode')
  .then(response => response.json())
  .then(data => {
    for (let i = 0; i < data.length; i++) {
    if (email===data[i].email && code === data[i].code ) {
      open = true;
      break;
    }
   
  }
  if (open) {
    chrome.storage.sync.set({ code: true }, function () {});
    location.reload();
  } else {
    alert('Invalid Code. Please Provide A Valid Code.');
  }
})
  .catch(error => console.error(error));
  
  // Do something with the code, e.g. open a page or execute some code
});
AppsumoOpenButton.addEventListener("click", () => {
  const appcode = AppsumoButton.value;

  fetch('https://blurrifyco.onrender.com/appsumo')
  .then(response => response.json())
  .then(data => {
    for (let i = 0; i < data.length; i++) {
    if (appcode === data[i].code ) {
      if(data[i].turn>0){
        open = true;
        fetch(`https://blurrifyco.onrender.com/appsumo/${appcode}`,{method:"PUT"}).
        then(response => response.json()).then(data=>{
        console.log(data)
        }).catch((err)=>{
          console.log(err)
        })
      }else{
        alert('Your Appsumo Trial Credit Has Finished');

      }
      break;
    }
  }
  if (open) {
    chrome.storage.sync.set({ code: true }, function () {});
    location.reload();
  } else {
    alert('Invalid Appsumo Code. Please Provide A Valid Code.');
  }
})
  .catch(error => console.error(error));
  
  // Do something with the code, e.g. open a page or execute some code
});


chrome.storage.sync.get("code", function (data) {
  if (data.code) {
    let blurLevel = 8;
    let menuDesc = document.querySelector("#menu-desc");
    let enableEvent = document.querySelector("#cursor-blur");
    let disableEvent = document.querySelector("#exit-blur");
    let removeAllBlur = document.querySelector("#remove-blur");
    
    
    enableEvent.addEventListener("mouseenter", updateDesc);
    enableEvent.addEventListener("mouseleave", updateDesc);
    enableEvent.addEventListener("click", (e) => {
      const param = {
        active: true,
        currentWindow: true,
      };
      chrome.tabs.query(param, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "blur",
          blurLevel: blurLevel,
        });
      });
      saveChanges();
    });
    
    disableEvent.addEventListener("mouseenter", updateDesc);
    disableEvent.addEventListener("mouseleave", updateDesc);
    disableEvent.addEventListener("click", (e) => {
      const param = {
        active: true,
        currentWindow: true,
      };
      chrome.tabs.query(param, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "exit",
          blurLevel: blurLevel,
        });
      });
    });
    
    removeAllBlur.addEventListener("mouseenter", updateDesc);
    removeAllBlur.addEventListener("mouseleave", updateDesc);
    removeAllBlur.addEventListener("click", (e) => {
      const param = {
        active: true,
        currentWindow: true,
      };
      chrome.tabs.query(param, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "remove",
          blurLevel: blurLevel,
        });
      });
    });
    
    let imgTest = document.getElementById("imageTest");
    let bgTxt = document.getElementById("bg-text");
    imgTest.style.setProperty(`--blur`, blurLevel + "px");
    bgTxt.style.setProperty(`--blur`, blurLevel + "px");
    
    let rangeSlider = document.getElementById("rs-range-line");
    let rangeBullet = document.getElementById("rs-bullet");
    rangeSlider.value = blurLevel;
    
    function updateDesc(e) {
      menuDesc.innerHTML = e.target.dataset.name;
      // Add some animation here
    }
    
    function saveChanges() {
      let blurLevelSelected = blurLevel;
      chrome.storage.sync.set({ blurLevel: blurLevelSelected }, function () {});
    }
    
    function showSliderValue() {
      rangeBullet.innerHTML = rangeSlider.value / 10;
      let bulletPosition = rangeSlider.value / rangeSlider.max;
      rangeBullet.style.left = bulletPosition * 257 + "px";
      blurLevel = rangeSlider.value;
      imgTest.style.setProperty(`--blur`, rangeSlider.value / 10 + "px");
      bgTxt.style.setProperty(`--blur`, rangeSlider.value / 10 + "px");
    }
    
    rangeSlider.addEventListener("input", showSliderValue, false);
    
    let menuIcon = document.querySelector("#menu-container");
    let menuList = menuIcon.querySelectorAll("button");
    menuList.forEach((ele) => {
      ele.dataset.clicked = "false";
    });
    
    menuIcon.addEventListener("click", (e) => {
      if (e.target.id === "menu-container") return;
      if (e.target.dataset.clicked === "true") return;
    
      // Otherwise, Disable others
      menuList.forEach((ele) => {
        if (ele.dataset.clicked === "true") {
          ele.classList.remove("clicked-menu-bg");
          ele.dataset.clicked = "false";
        }
      });
    
      // Enable
      if (e.target.nodeName === "path") {
        e.target.parentNode.parentNode.classList.add("clicked-menu-bg");
        e.target.parentNode.parentNode.dataset.clicked = "true";
      } else if (e.target.nodeName === "svg") {
        e.target.parentNode.classList.add("clicked-menu-bg");
        e.target.parentNode.dataset.clicked = "true";
      } else {
        e.target.classList.add("clicked-menu-bg");
        e.target.dataset.clicked = "true";
      }
    });
    
    chrome.storage.sync.get("blurLevel", function (data) {
      if (data.blurLevel) {
        blurLevel = data.blurLevel;
        rangeSlider.value = data.blurLevel;
        showSliderValue();
      } else {
        showSliderValue();
      }
    });
    
    myCard.style.display = "block";
    myHome.style.display = "none";
    
  } else {
    myCard.style.display = "none";
    myHome.style.display = "block";
  }
});


