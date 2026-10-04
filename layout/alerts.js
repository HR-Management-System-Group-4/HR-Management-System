// Shared feedback used by pages that save or update local application data.
(function () {
  const settings = {
    confirmButtonText: 'OK',
    confirmButtonColor: '#232743',
    buttonsStyling: false,
    customClass: {
      popup: 'mysta-popup',
      confirmButton: 'mysta-confirm'
    }
  };

  window.showAlert = function (type, title, message) {
    if (!window.Swal) {
      window.alert(`${title}\n${message}`);
      return Promise.resolve();
    }
    return Swal.fire({ ...settings, icon: type, title, text: message });
  };

  window.confirmAlert = function (title, message) {
    if (!window.Swal) return Promise.resolve(window.confirm(`${title}\n${message}`));
    return Swal.fire({
      ...settings,
      icon: 'warning',
      title,
      text: message,
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then(result => result.isConfirmed);
  };
})();
