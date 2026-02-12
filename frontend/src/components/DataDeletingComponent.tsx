import axios from "axios";
import { useState } from "react"
import { backend_base_url } from "../main";

export function DataDeletingComponent(){
    const [deletedDataResponse, setDeletedDataResponse] = useState<number | null>(null);
    const [isDeleted, setIsDeleted] = useState<boolean>(false);

    function deleteData(){
        axios.delete(`${backend_base_url}/api/readings?source=UPLOAD`).then(x => {
            setDeletedDataResponse(x.data?.deleted ?? 0);
        }).catch(err => {
            setDeletedDataResponse(null);
        }).finally(() => {
            setIsDeleted(true);
        })
    }
    
    return <div>
        <div>
        <button onClick={() => {
            deleteData();
        }}>Delete UPLOAD data</button>
        <p>{!isDeleted ? "" : (
            deletedDataResponse == null ? "Cleanup failed. Please try again." : (
                deletedDataResponse == 0 ? "No UPLOAD records found." : `Deleted ${deletedDataResponse} uploaded records.`
            )
        )}</p>
    </div>
    </div>
}