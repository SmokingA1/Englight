import React, {useCallback, useEffect} from "react";
import Admin from "../components/admin/Admin"
import api from "../api";
import { useNavigate } from "react-router-dom";
import { logger } from "../components/utils/logger";



const AdminPage: React.FC = () => {
    const navigate = useNavigate();

    const check_user = useCallback(async () => {
        try {
            const response = await api.get("/admin/check");
            logger.info(response.data)
            if (response.data !== true) {
                navigate("/")
            }
        } catch (error: any) {
            if (error.response) {
                logger.error("Server errror", error)
            } else {
                logger.error("Network or other error")
            }
        }
    }, [])

    useEffect(() => {
        check_user();
    })

    return(
        <Admin />
    )
}

export default AdminPage;
