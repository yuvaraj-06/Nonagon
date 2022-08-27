import { nodeBaseURL } from 'ApiURL';
import axios from 'axios'

const nonagonApi = {
    peopleCountList: (outletCode, interval)=>{
        axios.get(`${nodeBaseURL}customers/list/${outletCode}/${interval}`,
            {
                headers:{
                    
                }
            }
        )
    }
}