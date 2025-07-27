import Swal from 'sweetalert2';

export function SwalError(func = () => {}, errorText = '') {
  Swal.fire(
    'Oops',
    `Terjadi Kesalahan <br/> <small><i> ${errorText} </i></small>`,
    'error'
  ).then((e) => {
    if (e.isConfirmed || e.isDismissed) {
      func();
    }
  });
}

export function SwalSuccess(func = () => {}, text = '') {
  Swal.fire('Berhasil', text, 'success').then((e) => {
    if (e.isConfirmed || e.isDismissed) {
      func();
    }
  });
}

export function SwalLoading(text = 'Loading...') {
  Swal.fire({
    html: `<div class="flex flex-col justify-center items-center p-4  gap-2 ">
    <div class="loader"></div>
    <span>${text}</span>
    </div>`,
    background: '#ffffff00',
    backdrop: '#ffffff70',
    showConfirmButton: false,
    allowEscapeKey: false,
    allowOutsideClick: false,
  });
}
