import { toast } from 'react-toastify';

export function notifySuccess(text: string) {
    toast.success(text, {
        position: "top-right",
        autoClose: 10000, // Fecha após 10000 segundos
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    });
}

export function notifyError (text: string) {
    toast.error(text, {
        position: "top-right",
        autoClose: 10000, // Fecha após 10000 segundos
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    });
} 

export function notifyInfo (text: string) {
    toast.info(text, {
        position: "top-right",
        autoClose: 10000, // Fecha após 10000 segundos
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
    });
} 