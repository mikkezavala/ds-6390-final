import {useEffect, useState} from "react";

export function useTaxData() {
    const [data, setData] = useState([])

    useEffect(() => {
        fetch("/assets/original_data.json")
            .then((res) => res.json())
            .then(setData)
    }, [])

    return data
}