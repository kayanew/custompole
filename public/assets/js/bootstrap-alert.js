function toastMessage(message){
    const toastContainer = document.getElementsByClassName("toast-container");
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true"
       style="width: 380px; font-size: 16px;">
       
    <div class="toast-header">
      <img src="..." class="rounded me-2" alt="...">
      <strong class="me-auto">Message</strong>
      <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
    </div>

    <div class="toast-body" style="padding:16px;">
      ${message}
    </div>
  </div>`;
  toastContainer.appendChild(wrapper);
}

function showAlert(message, type){
    const alertPlaceHolder = document.querySelectorAll('.liveAlertPlaceholder');
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissable fade show" role="alert">
        ${message}
        <button type="button" class="close-btn" data-bs-dismiss="alert"></button>
        </div>
        `;
        // alertPlaceHolder.append(wrapper);
        alertPlaceHolder.forEach(placeholder=>{
            placeholder.appendChild(wrapper);
        })
}

const alertBtns = document.querySelectorAll('.alert-btn');
alertBtns.forEach(btn=>{
    btn.addEventListener('click',function(){
        showAlert("Showing alert", "success");
    })
})

const toastTrigger = document.getElementById('liveToastBtn')
const toastLiveExample = document.getElementById('liveToast')

if (toastTrigger) {
  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample)
  toastTrigger.addEventListener('click', () => {
    toastBootstrap.show()
  })
}