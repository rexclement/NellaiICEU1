import React, { useState, useEffect } from "react";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
import "./document.css";

// const BASE_URL = "https://iceu.onrender.com";
// const BASE_URL = "http://localhost:5000";

const Document = () => {
    const [documents, setDocuments] = useState({
        minutes: [],
        reports: [],
        schedule: [],
        songSheets: [],
        others: []
    });

    const [showForm, setShowForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("minutes");
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        axios
            .get(`/document`)
            .then((res) => setDocuments(res.data))
            .catch((err) => console.error("Error fetching documents:", err));
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            alert("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("category", selectedCategory);
        // console.log(formData);

        try {
            const response = await axios.post(`/document/add`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const { category, fileUrl, name } = response.data;

            setDocuments((prevDocs) => ({
                ...prevDocs,
                [category]: [
                    ...prevDocs[category],
                    { name, fileUrl } 
                ],
            }));

            // Reset
            setShowForm(false);
            setSelectedFile(null);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("File upload failed.");
        }
    };

    const handleRemoveFile = async (category, index) => {
        const docToRemove = documents[category][index];
        console.log ("docToRemove",docToRemove);
    
        try {
            const res = await axios.delete(`/document/delete`, {
                data: {
                    category,
                    fileUrl: docToRemove.fileUrl,
                }
            });
    
            // ✅ Set updated documents received from backend
            setDocuments(res.data);
        } catch (err) {
            console.error("Failed to delete document:", err);
            alert("Failed to delete document");
        }
    };
    
    return (
        <div className="document-container">
            <div className="document-header">
                <h2>Documents</h2>
                <button className="document-add-btn" onClick={() => setShowForm(true)}>
                    <i className="ri-add-circle-fill"></i>
                </button>
            </div>

            {showForm && (
                <div className="document-form-overlay">
                    <div className="document-form-container">
                        <h3 className="document-h3">Upload Document</h3>
                        <form onSubmit={handleFormSubmit}>
                            <label>Category:</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="minutes">Minutes</option>
                                <option value="reports">Reports</option>
                                <option value="schedule">Schedule</option>
                                <option value="songSheets">Song Sheets</option>
                                <option value="others">Others</option>
                            </select>

                            <label>Upload File:</label>
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.doc,.docx,.txt"
                            />

                            <div className="document-form-buttons">
                                <button type="submit">Upload</button>
                                <button type="button" onClick={() => setShowForm(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="document-document-sections">
                {Object.keys(documents).map((category) => (
                    <div key={category} className="document-section">
                        <h3 className="document-h3">
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h3>
                        <ul className="document-ul">
                            {documents[category].length > 0 ? (
                                documents[category].map((doc, index) => (
                                    <li className="document-li" key={index}>
                                        <a
                                            className="document-a"
                                            href={doc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {doc.name}
                                        </a>
                                        <button
                                            className="document-delete-btn"
                                            onClick={() => handleRemoveFile(category, index)}
                                        >
                                            <i className="ri-close-circle-fill"></i>
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <p>No documents uploaded.</p>
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Document;
