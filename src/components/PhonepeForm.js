import axios from 'axios';
import React,{useState} from 'react';

export default function PhonepeForm () {

    const [form,serForm] = useState({
        name : "Akram",
        number : "8008129519",
    });
    const [amount,setAmount] = useState(1);

    const handleSubmit = (e) =>{
        e.perventDefault();
        axios.post('api/phonepe/payment',{
            data:{
                ...form,
                amount: amount
            }
        }).then(response =>{
            window.location.href = response.data;
        }).catch(error=>{
            console.error(error);
        });
    }

    return(
        <form onSubmit={handleSubmit}>
        <button type="submit"> Pay </button>
        </form>
    )

}
// export default PhonepeForm;