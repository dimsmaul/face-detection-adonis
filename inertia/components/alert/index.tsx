/* eslint-disable @typescript-eslint/no-explicit-any */
import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)
export const callAlert = ({
  type,
  title,
  message,
  onConfirm,
  options,
}: {
  type: 'success' | 'question' | 'warning' | 'error'
  title: string
  message: string
  // biome-ignore lint/suspicious/noExplicitAny: unexpected result
  onConfirm?: (result: any) => void
  options?: SweetAlertOptions
}) => {
  let icon: SweetAlertIcon = 'error',
    iconColor
  if (type === 'success') {
    icon = 'success'
    iconColor = '#12B76A'
  }
  if (type === 'question') {
    icon = 'question'
    iconColor = '#FE7A00'
  }
  if (type === 'warning') {
    icon = 'warning'
    iconColor = '#2D90FA'
  }
  if (type === 'error') {
    icon = 'error'
    iconColor = 'lightred'
  }
  MySwal.fire({
    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      htmlContainer: 'custom-swal-content',
      confirmButton: 'custom-swal-confirm',
      cancelButton: 'custom-swal-cancel',
      actions: 'custom-swal-actions',
    },
    html: `<div style="padding-bottom: 20px;" class="border-b-[1.5px]"><p class="text-3xl font-medium">${title}</p><div style="font-size:16px; margin-top:10px;padding-left: 0.9rem;padding-right:0.9rem">${message}</div></div>`,
    icon,
    iconColor,
    width: 400,
    showCancelButton: onConfirm !== undefined,
    buttonsStyling: false,
    confirmButtonText: 'OK',
    reverseButtons: true,
    ...options,
  }).then(onConfirm)
}

export const confirmAPIForm = async ({
  type,
  title,
  message,
  options,
  onAlertSuccess,
  callAPI,
}: {
  type?: 'success' | 'question' | 'warning' | 'error'
  title?: string
  message?: string
  options?: SweetAlertOptions
  onAlertSuccess: () => void
  callAPI: () => any
}) => {
  callAlert({
    type: type ?? 'question',
    title: title ?? 'Confirmation',
    message: message ?? 'Are you sure to send the request?',
    options: {
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: async () => {
        let result = true
        result = await callAPI().then(
          (value: { error: { data: { message: string }; message: string } }) => {
            if (value.error) {
              callAlert({
                type: 'error',
                title: 'Failed',
                message: value.error.data.message || value.error.message,
              })
            } else {
              callAlert({
                type: 'success',
                title: 'Success!',
                message: 'Request was successfully sent',
                options: {
                  showCancelButton: false,
                  willClose: () => onAlertSuccess(),
                },
              })
            }
            return true
          }
        )
        return result
      },
      ...options,
    },
    onConfirm: (result) => {
      if (result.isConfirmed) {
        //
      }
    },
  })
}
