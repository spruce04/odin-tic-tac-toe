const gameBoard = (() => {
    //to do
})();

const Player = (name) => {
    //to do
};

//NEED TO FINISH making other methods private
const DisplayController = (() => {
    //change colour scheme when button is clicked
    let vsBot = false;
    const checkMode = (r) => {
        if(r == undefined){return};//when it is first called
        const rs = getComputedStyle(r);
        const holdValue = rs.getPropertyValue('--main-colour');
        r.style.setProperty('--main-colour', rs.getPropertyValue('--side-colour'));
        r.style.setProperty('--side-colour', holdValue);
        vsBot ? (vsBot=false,  toggle.innerHTML = 'Play vs Bot') : (vsBot=true, toggle.innerHTML='Play vs Player');
        console.log(vsBot);
    };
    return {
        checkMode
    };
})();

const toggle = document.getElementById("toggleMode")
toggle.addEventListener("click", () => {
    const r = document.querySelector(":root");
    DisplayController.checkMode(r);
});