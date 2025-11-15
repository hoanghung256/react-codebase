import { useSelector } from "react-redux";

function useLoading() {
    const { loading } = useSelector((state) => state.auth);
    return loading;
}

export default useLoading;