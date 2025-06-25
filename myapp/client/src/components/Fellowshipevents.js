import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import "./Event.css";
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from "docx";
import { saveAs } from "file-saver";

// const BASE_URL = "https://iceu.onrender.com";
// const BASE_URL = "http://localhost:5000";

const FellowshipEvent = () => {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    eventName: "",
    year: "",
    date: "",
    place: "",
    outcome: "",
    flier: null,
    participants_count: '',
    description: "",
    NOSCTGIC: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    axios
      .get(`/events/fellowship`)
      .then((res) => {
        // Sort events by order if they are not sorted in the backend query
        setEvents(res.data.sort((a, b) => a.order - b.order));
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const handleDelete = async (index) => {
    const eventId = events[index]._id;
    try {
      await axios.delete(`/events/delete/${eventId}`, {
        data: {
          category: "Fellowship"
        }
      });
      setEvents(events.filter((_, i) => i !== index));
    } catch (err) {
      console.error("Error deleting event:", err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fileData = new FormData();

    const dataToSend = {
      ...formData,
      participants_count: parseInt(formData.participants_count) || 0,
      NOSCTGIC: parseInt(formData.NOSCTGIC) || 0,
      category: "Fellowship",
    };
  
    Object.entries(dataToSend).forEach(([key, value]) => {
      if (key === "flier" && value ) {
        fileData.append("flier", value);
      } else {
        fileData.append(key, value);
      }
    });
    

    const url =
      editIndex !== null
        ? `/events/${events[editIndex]._id}`
        : `/events`;
    const method = editIndex !== null ? "put" : "post";

    try {
      const response = await axios({
        method,
        url,
        data: fileData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedEvent = response.data;
      setEvents((prev) =>
        editIndex !== null
          ? prev.map((item, i) => (i === editIndex ? updatedEvent : item))
          : [...prev, updatedEvent]
      );
      resetForm();
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  const resetForm = () => {
    setEditIndex(null);
    setFormData({
    eventName: "",
    year: "",
    date: "",
    place: "",
    outcome: "",
    flier: null,
    participants_count: '',
    description: "",
    NOSCTGIC:"",
    });
    setShowForm(false);
  };

  const filteredEvents = yearFilter
    ? events.filter((e) => e.year === yearFilter)
    : events;

    const handleDragEnd = async (result) => {
      if (!result.destination) return;
    
      const reordered = Array.from(events);
      const [movedItem] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, movedItem);
    
      // Update frontend state immediately
      setEvents(reordered);
      // Send updated order to backend
      try {
        await axios.put(`/events/reorder`, {
          reorderedIds: reordered.map((event, index) => ({
            id: event._id,
            order: index
          })),
          category: "Fellowship"
        });
      } catch (error) {
        console.error("Error saving reordered events:", error);
      }
    };


    const downloadAsDocx = () => {
      const rows = [];
    
      // Header Row
      rows.push(
        new TableRow({
          children: [
            "Year", "Name", "Date", "Place", "Participants", "No of Students Committed to Grow In Christ", "Outcome"
          ].map(text => new TableCell({ children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })] }))
        })
      );
    
      // Data Rows
      filteredEvents.forEach(event => {
        rows.push(
          new TableRow({
            children: [
              event.year,
              event.eventName,
              event.date,
              event.place,
              `${event.participants_count || 0}`,
              `${event.NOSCTGIC || 0}`,
              event.outcome || ""
            ].map(text => new TableCell({ children: [new Paragraph(text)] }))
          })
        );
      });
    
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                text: "Event Report",
                heading: "Heading1",
                spacing: { after: 300 }
              }),
              new Table({
                rows: rows,
              }),
            ],
          },
        ],
      });
    
      Packer.toBlob(doc).then((blob) => {
        saveAs(blob, "Event_Report.docx");
      });
    };


  return (
    <div className="event-container">
      <h2>Fellowship Event</h2>

     
      <div className="top-controls">
  <button onClick={() => setShowForm(true)}>Add Event</button>
  <input
    type="text"
    placeholder="Filter by Year"
    value={yearFilter}
    onChange={(e) => setYearFilter(e.target.value)}
  />
  <button onClick={downloadAsDocx}>Download as DOCX</button>

</div>


      {showForm && (
        <form onSubmit={handleSubmit} className="event-form">
          <label>Enter Event Name:</label>
          <input
            type="text"
            placeholder="Event Name"
            value={formData.eventName}
            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
            required
          />
          <label>Enter Year:</label>
          <input
            type="text"
            placeholder="Year"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
            required
          />
          <label>Enter Date:</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            
          />
          <label>Enter Place:</label>
          <input
            type="text"
            placeholder="Place"
            value={formData.place}
            onChange={(e) => setFormData({ ...formData, place: e.target.value })}
            
          />
          <label>Enter Participants Count:</label>
          <input
            type="number"
            placeholder="Participant Count"
            value={formData.participants_count}
            onChange={(e) =>
              setFormData({ ...formData, participants_count: e.target.value })
            }
          />
          <label>Enter outcome:</label>
          <input
            type="text"
            placeholder="Outcome"
            value={formData.outcome}
            onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
          />
          <label>Select File:</label>
          <input
            type="file"
            onChange={(e) => setFormData({ ...formData, flier: e.target.files[0] })}
          />
          {editIndex !== null && (
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
              <p
                style={{
                  fontStyle: 'italic',
                  color: '#666',
                  fontSize: '14px',
                  marginBottom: '10px',
                  lineHeight: '1.5',
                }}
              >
                If you uploaded the flier before, you can skip this column — no need to re-upload it.
              </p>
              <select
                style={{
                  padding: '8px 12px',
                  fontSize: '14px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  outline: 'none',
                  width: '200px',
                  backgroundColor: '#f9f9f9',
                }}
                onChange={(e) =>
                  setFormData({ ...formData, flier_condition: e.target.value })
                }
              >
                <option value="same">Same</option>
                <option value="default">Default</option>
              </select>
            </div>
          )}

          <label>Enter Description:</label>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
         <label>No of Students Committed to Grow In Christ</label>
          <input
            type="number"
            placeholder="No of Students Committed to Grow In Christ"
            value={formData.NOSCTGIC}
            onChange={(e) =>
              setFormData({ ...formData, NOSCTGIC: e.target.value })
            }
          />
          
          <button type="submit">{editIndex !== null ? "Update" : "Create"} Event</button>
          <button type="button" onClick={resetForm}>Cancel</button>
        </form>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="eventTable">
          {(provided) => (
            <table className="event-table" {...provided.droppableProps} ref={provided.innerRef}>
              <thead>
                <tr>
                  <th>Flier</th>
                  <th>Year</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Place</th>
                  <th>Participants</th>
                  <th>No of Students Committed to Grow In Christ</th>
                  <th>Outcome</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, index) => (
                  <Draggable key={event._id} draggableId={event._id} index={index}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <td>
                          <img
                            src={
                              event.flier
                                ? event.flier
                                : null
                            }
                            alt="Flier"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                          />
                        </td>
                        <td>{event.year}</td>
                        <td>{event.eventName}</td>
                        <td>{event.date}</td>
                        <td>{event.place}</td>
                        <td>{event.participants_count || 0}</td>
                        <td>{event.NOSCTGIC || 0}</td>
                        <td>{event.outcome}</td>
                        <td>
                          <FiEdit2
                            className="icon-btn edit-icon"
                            onClick={() => {
                              setFormData({
                                eventName: event.eventName,
                                year: event.year,
                                date: event.date,
                                place: event.place,
                                participants_count: event.participants_count,
                                outcome: event.outcome,
                                flier: null,
                                description: event.description,
                                NOSCTGIC: event.NOSCTGIC,
                              });
                              setEditIndex(index);
                              setShowForm(true);
                            }}
                          />
                          <FiTrash2
                            className="icon-btn delete-icon"
                            onClick={() => handleDelete(index)}
                          />
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
  );
};

export default FellowshipEvent;


