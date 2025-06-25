import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import "./PrayerCellManager.css";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";

// const BASE_URL = "https://iceu.onrender.com";
// const BASE_URL = "http://localhost:5000";

const PrayerCellManager = () => {
  const [collegeCells, setCollegeCells] = useState([]);
  const [schoolCells, setSchoolCells] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editType, setEditType] = useState(null);
  const [formData, setFormData] = useState({
    type: "college",
    institution: "",
    prayerCellName: "",
    cellType: "",
    locationType: "",
    gender: "",
    timesHeld: "",
    avgParticipants: "",
    handledBy: "",
    remark: "",
  });

  const [collegeFilters, setCollegeFilters] = useState({
    institution: "",
    cellType: "",
    locationType: "",
    gender: "",
  });

  const [schoolFilters, setSchoolFilters] = useState({
    institution: "",
    cellType: "",
    locationType: "",
    gender: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCollegeFilterChange = (e) => {
    setCollegeFilters({ ...collegeFilters, [e.target.name]: e.target.value });
  };

  const handleSchoolFilterChange = (e) => {
    setSchoolFilters({ ...schoolFilters, [e.target.name]: e.target.value });
  };


  useEffect(() => {
    axios
      .get(`/cell/all`)
      .then((res) => {
        const collegeData = res.data.college.sort((a, b) => a.order - b.order);
        const schoolData = res.data.school.sort((a, b) => a.order - b.order);
  
        setCollegeCells(collegeData);
        setSchoolCells(schoolData);
      })
      .catch((err) => console.error("Error fetching cells:", err));
  }, []);
  




  const addCell = async () => {
    try {
      const identifer = formData.type=='college'?collegeCells[editIndex]._id : schoolCells[editIndex]._id;
      const method = editIndex !== null ? 'put' : 'post';
      const url = 
  editIndex !== null
    ? `/cell/update/`  // Sending event ID for reorder action
    : `/cell/add`;  // URL for creating new cell reorder or other default actions
      console.log(formData);
      const response = await axios[method](url, {
        data: formData,
        type: formData.type,
        id: identifer
      });
  
      const savedData = response.data;
  
      if (formData.type === "college") {
        setCollegeCells(prev => {
          const updated = [...prev];
          if (editIndex !== null) {
            updated[editIndex] = savedData;
            return updated;
          }
          return [...prev, savedData];
        });
      } else {
        setSchoolCells(prev => {
          const updated = [...prev];
          if (editIndex !== null) {
            updated[editIndex] = savedData;
            return updated;
          }
          return [...prev, savedData];
        });
      }
  
    } catch (error) {
      console.error('Error submitting cell data:', error);
    }
  
    // Reset form and editing state
    setFormData({
      type: "college",
      institution: "",
      prayerCellName: "",
      cellType: "",
      locationType: "",
      gender: "",
      timesHeld: "",
      avgParticipants: "",
      handledBy: "",
      remark: "",
    });
    setShowForm(false);
    setEditIndex(null);
    setEditType(null);
  };
  
  const handleEdit = (index, type) => {
    if (type === "college") {
      setFormData({ ...collegeCells[index], type: "college" });
    } else {
      setFormData({ ...schoolCells[index], type: "school" });
    }
    setEditIndex(index);
    setEditType(type);
    setShowForm(true);
  };

  const handleDelete = async (index, type) => {
    try {
      const cellId = type === "college" ? collegeCells[index]._id : schoolCells[index]._id;
  
      await axios.delete(`/cell/delete/${cellId}`, {
        params: { type }, // send type in query params
      });
  
      if (type === "college") {
        const updated = [...collegeCells];
        updated.splice(index, 1);
        setCollegeCells(updated);
      } else {
        const updated = [...schoolCells];
        updated.splice(index, 1);
        setSchoolCells(updated);
      }
    } catch (error) {
      console.error("Error deleting cell:", error);
    }
  };
  

  const filteredCollegeCells = collegeCells.filter((cell) => {
    return (
      (!collegeFilters.institution || cell.institution.includes(collegeFilters.institution)) &&
      (!collegeFilters.cellType || cell.cellType === collegeFilters.cellType) &&
      (!collegeFilters.locationType || cell.locationType === collegeFilters.locationType) &&
      (!collegeFilters.gender || cell.gender === collegeFilters.gender)
    );
  });

  const filteredSchoolCells = schoolCells.filter((cell) => {
    return (
      (!schoolFilters.institution || cell.institution.includes(schoolFilters.institution)) &&
      (!schoolFilters.cellType || cell.cellType === schoolFilters.cellType) &&
      (!schoolFilters.locationType || cell.locationType === schoolFilters.locationType) &&
      (!schoolFilters.gender || cell.gender === schoolFilters.gender)
    );
  });

  


  const handleDragEnd = async (result, type) => {
    if (!result.destination) return;
  
    const items = type === "college" ? [...filteredCollegeCells] : [...filteredSchoolCells];
    
    const [movedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedItem);
  
    // Update the state locally
    if (type === "college") {
      setCollegeCells(items);
    } else {
      setSchoolCells(items);
    }
  
    // Send reorder request
    const reorderedIds = items.map((cell, index) => ({
      id: cell._id,
      order: index + 1, // Order starts from 1
    }));
  
    try {
      await axios.put(`/cell/reorder`, {
        reorderedIds,
        type,
      });
      console.log("Order updated successfully!");
    } catch (error) {
      console.error("Failed to reorder cells:", error);
    }
  };
  


  

// const handleDownload = () => {
//   const headers = [
//     "Institution", "Prayer Cell Name", "Cell Type", "Location Type", "Gender",
//     "Times Held", "Avg Participants", "Handled By", "Remark"
//   ];

//   const tableRows = [
//     // Header row
//     new TableRow({
//       children: headers.map(header =>
//         new TableCell({
//           children: [new Paragraph({ children: [new TextRun({ text: header, bold: true })] })],
//           width: { size: 11, type: WidthType.PERCENTAGE },
//         })
//       ),
//     }),
//     // Data rows
//     ...db.cells.map(cell =>
//       new TableRow({
//         children: [
//           cell.institution,
//           cell.prayerCellName,
//           cell.cellType,
//           cell.locationType,
//           cell.gender,
//           cell.timesHeld,
//           cell.avgParticipants,
//           cell.handledBy,
//           cell.remark,
//         ].map(value =>
//           new TableCell({
//             children: [new Paragraph(value || "")],
//             width: { size: 11, type: WidthType.PERCENTAGE },
//           })
//         ),
//       })
//     ),
//   ];

//   const doc = new Document({
//     sections: [
//       {
//         children: [
//           new Paragraph({
//             children: [
//               new TextRun({
//                 text: `${db.type} Prayer Cells Details`,
//                 bold: true,
//                 size: 32,
//               }),
//             ],
//           }),
//           new Paragraph({ text: "\n" }),
//           new Table({
//             rows: tableRows,
//             width: { size: 100, type: WidthType.PERCENTAGE },
//           }),
//         ],
//       },
//     ],
//   });

//   Packer.toBlob(doc).then(blob => {
//     saveAs(blob, `${db.type}_Prayer_Cell_Details.docx`);
//   });
// };
const handleDownload = (type) => {
  const cells = type === "college" ? filteredCollegeCells : filteredSchoolCells;

  const headers = [
    "Institution", "Prayer Cell Name", "Cell Type", "Location Type", "Gender",
    "Times Held", "Avg Participants", "Handled By", "Remark"
  ];

  const tableRows = [
    new TableRow({
      children: headers.map(header =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: header, bold: true })] })],
          width: { size: 11, type: WidthType.PERCENTAGE },
        })
      ),
    }),
    ...cells.map(cell =>
      new TableRow({
        children: [
          cell.institution,
          cell.prayerCellName,
          cell.cellType,
          cell.locationType,
          cell.gender,
          cell.timesHeld,
          cell.avgParticipants,
          cell.handledBy,
          cell.remark,
        ].map(value =>
          new TableCell({
            children: [new Paragraph(String(value ?? ""))],
            width: { size: 11, type: WidthType.PERCENTAGE },
          })
        ),
      })
    ),
  ];

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: `${type.charAt(0).toUpperCase() + type.slice(1)} Prayer Cells Details`,
                bold: true,
                size: 32,
              }),
            ],
          }),
          new Paragraph({ text: "\n" }),
          new Table({
            rows: tableRows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then(blob => {
    saveAs(blob, `${type}_Prayer_Cell_Details.docx`);
  });
};



  return (
    <div className="prayer-cell-manager">
      {/* College Section */}
      <h1 className="main-heading">College Prayer Cell Details</h1>
      <div className="header">
        <div className="filters">
          {/* College filters */}
          <input
            type="text"
            name="institution"
            placeholder="Search Institution"
            value={collegeFilters.institution}
            onChange={handleCollegeFilterChange}
          />
          <select name="cellType" value={collegeFilters.cellType} onChange={handleCollegeFilterChange}>
            <option value="">All Cell Types</option>
            <option value="EBS">EBS</option>
            <option value="BBS">BBS</option>
          </select>
          <select name="locationType" value={collegeFilters.locationType} onChange={handleCollegeFilterChange}>
            <option value="">All Locations</option>
            <option value="On Campus">On Campus</option>
            <option value="Off Campus">Off Campus</option>
            <option value="Area">Area</option>
          </select>
          <select name="gender" value={collegeFilters.gender} onChange={handleCollegeFilterChange}>
            <option value="">All Genders</option>
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
            <option value="Combined Prayer Cell">Combined Prayer Cell</option>
          </select>
        </div>
        <button onClick={() => handleDownload("college")}>Download</button>
        <button className="add-button" onClick={() => { setShowForm(true); setFormData({ ...formData, type: "college" }); }}>+ Add College Cell</button>
      </div>

      <div className="table-container">
        <DragDropContext onDragEnd={(result) => handleDragEnd(result, "college")}>
          <Droppable droppableId="collegeCells">
            {(provided) => (
              <table ref={provided.innerRef} {...provided.droppableProps}>
                <thead>
                  <tr>
                    <th>Institution</th>
                    <th>Prayer Cell</th>
                    <th>Cell Type</th>
                    <th>Location</th>
                    <th>Gender</th>
                    <th>Times Held</th>
                    <th>Avg Participants</th>
                    <th>Handled By</th>
                    <th>Remark</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCollegeCells.map((cell, index) => (
                    <Draggable key={index} draggableId={`college-${index}`} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="row-hover"
                        >
                          <td>{cell.institution}</td>
                          <td>{cell.prayerCellName}</td>
                          <td>{cell.cellType}</td>
                          <td>{cell.locationType}</td>
                          <td>{cell.gender}</td>
                          <td>{cell.timesHeld}</td>
                          <td>{cell.avgParticipants}</td>
                          <td>{cell.handledBy}</td>
                          <td>{cell.remark}</td>
                          <td className="actions">
                            <FaEdit onClick={() => handleEdit(index, "college")} className="icon edit-icon" />
                            <FaTrash onClick={() => handleDelete(index, "college")} className="icon delete-icon" />
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* School Section */}
      <h1 className="main-heading">HSS School Prayer Cell Details</h1>
      <div className="header">
        <div className="filters">
          {/* School filters */}
          <input
            type="text"
            name="institution"
            placeholder="Search Institution"
            value={schoolFilters.institution}
            onChange={handleSchoolFilterChange}
          />
          <select name="cellType" value={schoolFilters.cellType} onChange={handleSchoolFilterChange}>
            <option value="">All Cell Types</option>
            <option value="EBS">EBS</option>
            <option value="BBS">BBS</option>
          </select>
          <select name="locationType" value={schoolFilters.locationType} onChange={handleSchoolFilterChange}>
            <option value="">All Locations</option>
            <option value="On Campus">On Campus</option>
            <option value="Off Campus">Off Campus</option>
            <option value="Area">Area</option>
          </select>
          <select name="gender" value={schoolFilters.gender} onChange={handleSchoolFilterChange}>
            <option value="">All Genders</option>
            <option value="Boys">Boys</option>
            <option value="Girls">Girls</option>
            <option value="Combined Prayer Cell">Combined Prayer Cell</option>
          </select>
        </div>
        <button onClick={() => handleDownload("school")}>Download</button>
        <button className="add-button" onClick={() => { setShowForm(true); setFormData({ ...formData, type: "school" }); }}>+ Add School Cell</button>
      </div>

      <div className="table-container">
        <DragDropContext onDragEnd={(result) => handleDragEnd(result, "school")}>
          <Droppable droppableId="schoolCells">
            {(provided) => (
              <table ref={provided.innerRef} {...provided.droppableProps}>
                <thead>
                  <tr>
                    <th>Institution</th>
                    <th>Prayer Cell</th>
                    <th>Cell Type</th>
                    <th>Location</th>
                    <th>Gender</th>
                    <th>Times Held</th>
                    <th>Avg Participants</th>
                    <th>Handled By</th>
                    <th>Remark</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchoolCells.map((cell, index) => (
                    <Draggable key={index} draggableId={`school-${index}`} index={index}>
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="row-hover"
                        >
                          <td>{cell.institution}</td>
                          <td>{cell.prayerCellName}</td>
                          <td>{cell.cellType}</td>
                          <td>{cell.locationType}</td>
                          <td>{cell.gender}</td>
                          <td>{cell.timesHeld}</td>
                          <td>{cell.avgParticipants}</td>
                          <td>{cell.handledBy}</td>
                          <td>{cell.remark}</td>
                          <td className="actions">
                            <FaEdit onClick={() => handleEdit(index, "school")} className="icon edit-icon" />
                            <FaTrash onClick={() => handleDelete(index, "school")} className="icon delete-icon" />
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h3 className="form-heading">{editIndex !== null ? "Edit Prayer Cell" : "Add New Prayer Cell"} ({formData.type})</h3>
            <input type="text" name="institution" placeholder="Institution" value={formData.institution} onChange={handleInputChange} required />
             <input type="text" name="prayerCellName" placeholder="Prayer Cell Name" value={formData.prayerCellName} onChange={handleInputChange} required />
             <select name="cellType" value={formData.cellType} onChange={handleInputChange}>
               <option value="">Select Cell Type</option>
              <option value="EBS">EBS</option>
               <option value="BBS">BBS</option>
             </select>
             <select name="locationType" value={formData.locationType} onChange={handleInputChange}>
               <option value="">Select Location</option>
               <option value="On Campus">On Campus</option>
               <option value="Off Campus">Off Campus</option>
               <option value="Hostel">Hostel</option>
             </select>
             <select name="gender" value={formData.gender} onChange={handleInputChange}>
               <option value="">Select Gender</option>
               <option value="Boys">Boys</option>
               <option value="Girls">Girls</option>
               <option value="Combined Prayer Cell">Combined Prayer Cell</option>
             </select>
             <input type="number" name="timesHeld" placeholder="Times Held" value={formData.timesHeld} onChange={handleInputChange} />
             <input type="number" name="avgParticipants" placeholder="Avg Participants" value={formData.avgParticipants} onChange={handleInputChange} />
             <input type="text" name="handledBy" placeholder="Handled By" value={formData.handledBy} onChange={handleInputChange} />
             <input type="text" name="remark" placeholder="Remark" value={formData.remark} onChange={handleInputChange} />
             <div className="form-buttons">
               <button className="submit-button" onClick={addCell}>Add</button>
               <button className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrayerCellManager;
