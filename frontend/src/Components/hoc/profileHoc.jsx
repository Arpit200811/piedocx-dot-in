import axios from "axios";
import { base_url } from "../../utils/info";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function profileHoc(EmpProfile) {
  return () => {
    const [data, setData] = useState("");
    const nav = useNavigate();

    useEffect(() => {
      const getUserInfo = async () => {
        try {
          const res = await axios.get(`${base_url}/employee/profile`, {
            withCredentials: true,
          });
          console.log("hello!!!!", res.data);
          if (res.error) {
            nav("/emp-login");
          }

        } catch (error) {
          console.log("hello!!!!err", error);

        }
      };
      getUserInfo();
    }, []);

    return <EmpProfile data={data} />;
  };
}

export default profileHoc;
