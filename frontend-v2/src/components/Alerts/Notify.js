import { toast } from 'react-toastify';
export const NotifyWrapper = {
    success: (msg) => {
        toast.success(msg);
    },
    warning: (msg) => {
        toast.warn(msg);
    }
};