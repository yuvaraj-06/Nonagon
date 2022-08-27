import React from 'react';
import { Button } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotifyWrapper } from './Notify';
toast.configure();

const ToastAlert = () => {
    
    return (
        <div>
            <Button onClick={NotifyWrapper.success("success")}>Notify!</Button>
            <ToastContainer />
        </div>
    );
}

export default ToastAlert;