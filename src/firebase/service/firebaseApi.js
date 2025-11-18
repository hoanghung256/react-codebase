export const getImages = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}`);
    if (!res.ok) throw new Error("Failed to fetch images");
    return res.json();
};

export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${import.meta.env.VITE_API_URL}`, {
        method: "POST",
        body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
};

export const deleteImage = async (fileName) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName: fileName }),
    });
    if (!res.ok) throw new Error("Delete failed");
    return res.text();
};
