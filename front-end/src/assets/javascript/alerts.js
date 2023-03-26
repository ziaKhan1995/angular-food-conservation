function hi(){
  alerts('1111');
  const alerts = document.querySelectorAll(".fa-times-circle");
const alertsFade = document.querySelectorAll(".alert-fade");

const options = { attributes: true };

let count = 0;

function getAlert(el) {
  if (el.classList.contains("alert")) return el;
  else return getAlert(el.parentNode);
}

function checkShowing(el) {
  if (el.classList.contains("alert_none")) return false;
  else return true;
}

alerts.forEach((el) =>
  el.addEventListener("click", () => {
    const father = getAlert(el);
    father.classList.toggle("alert_none");
  })
);

const onClassChange = new Event(`classChange`);

function createNewObserver() {
  const observer = new MutationObserver((mutationList) => {
    const alert = mutationList[0].target;
    observer.disconnect();
    if (!alert.classList.contains("alert_none"))
      alert.dispatchEvent(onClassChange);
  });
  return observer;
}

alertsFade.forEach((el) => {
  const mutation = createNewObserver();
  mutation.observe(el, options);
});

alertsFade.forEach((el) =>
  el.addEventListener("classChange", (ev) => {
    const alert = ev.target;
    if (!alert.classList.contains("alert_none")) {
      const time = parseInt(alert.getAttribute("data-fade-time")) * 1000;
      setTimeout(() => {
        alert.classList.toggle("alert_none");
        const mutation = createNewObserver();
        mutation.observe(alert, options);
      }, time);
    }
  })
);

}